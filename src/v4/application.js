// @version v4.0
// 引入事件模块 - 处理异常事件

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

      let len = this.middlewares.length
      let next = async () => Promise.resolve()
      while (len--) {
        const currentMiddleware = this.middlewares[len]
        next = createNext(currentMiddleware, next)
      }
      await next()
    }
  }

  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx)
      const onerror = error => this.onerror(error, ctx) // 增加异常处理
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

  // 异常处理
  onerror(error, ctx) {
    if (error.code === 'ENOENT') {
      ctx.status = 404
    } else {
      ctx.status = 500
    }
    const msg = error.message || 'Internal Error'
    ctx.res.end(msg)
    this.emit('error', error)
  }
}

module.exports = Application
