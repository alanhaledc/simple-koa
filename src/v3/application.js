/**
 * @version v3.0
 * 引入中间机制
 * 洋葱模型
 */
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application {
  constructor() {
    // this.callbackFn = null // 删除单个 cb，由中间件机制替换
    this.middlewares = [] // 增加中间件队列
    this.context = context
    this.request = request
    this.response = response
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }

  /**
   * 挂载中间件
   * @param {Array<Function>} middleware
   */
  use(middleware) {
    this.middlewares.push(middleware)
  }

  /**
   * 中间件的合并方法
   * 按顺序合并，并一一调用
   * @returns
   */
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

  /**
   * server 所需的 callback 函数
   * @returns
   */
  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx)
      // this.callbackFn(ctx).then(respond)
      const fn = this.compose() // 中间件处理函数
      return fn(ctx).then(respond)
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
}

module.exports = Application
