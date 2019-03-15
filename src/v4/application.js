/**
 * @version v4.0
 * 引入事件模块
 * 可以监听错误事件，处理错误事件
 */

const Emitter = require('events') // 引入事件模块
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

// 继承事件模块
class Application extends Emitter {
  constructor() {
    super()
    this.middlewares = []
    this.context = context
    this.request = request
    this.response = response
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  compose() {
    return async ctx => {
      function createNext(middleware, oldNext) {
        return async () => await middleware(ctx, oldNext)
      }

      const len = this.middlewares.length
      let next = async () => Promise.resolve()
      for (let i = len - 1; i >= 0; i--) {
        const currentMiddleware = this.middlewares[i]
        next = createNext(currentMiddleware, next)
      }
      await next()
    }
  }

  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx)
      const onerror = err => this.onerror(err, ctx) // 增加异常处理
      const fn = this.compose()
      return fn(ctx)
        .then(respond)
        .catch(onerror) // 增加异常处理
    }
  }

  createContext(req, res) {
    const ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }

  responseBody(ctx) {
    const content = ctx.body
    if (typeof content === 'string') {
      ctx.res.end(content)
    } else if (typeof content === 'object') {
      ctx.res.end(JSON.stringify(content))
    }
  }

  /**
   * 异常处理方法
   * @memberof Application
   */
  onerror(err, ctx) {
    if (err.code === 'ENOENT') {
      ctx.status = 404
    } else {
      ctx.status = 500
    }
    const msg = err.message || 'Internal Error'
    ctx.res.end(msg)
    this.emit('error', err)
  }
}

module.exports = Application
