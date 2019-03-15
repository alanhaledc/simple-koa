/**
 * @version v2.0
 * 封装 Node 原生的 request 和 response
 * 使用上下文 context 代理封装好的 request 和 response
 */
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application {
  constructor() {
    this.callbackFn = null
    this.context = context
    this.request = request
    this.response = response
  }

  /**
   * 创建 server，并且传入 callback
   */
  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }

  /**
   * 挂载回调函数
   * @param {Function} fn
   */
  use(fn) {
    this.callbackFn = fn
  }

  /**
   * 创建 server 所需的 callback 函数
   * @returns {Function}
   */
  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx) // 正常输出
      this.callbackFn(ctx).then(respond) // Promise 的 then 输出
    }
  }

  /**
   * 构建 context 上下文
   * @param {Request} req
   * @param {Response} res
   * @returns
   */
  createContext(req, res) {
    const ctx = Object.create(this.context) // 创建 ctx 对象
    ctx.request = Object.create(this.request) // 模块 request 过载给 ctx.request
    ctx.response = Object.create(this.response) // 模块 response 过载给 ctx.response
    ctx.req = ctx.request.req = req // 把原生 request 过载给 ctx.req
    ctx.res = ctx.response.res = res // 把原生 response 过载给 ctx.res
    return ctx
  }

  /**
   * 对客户端的回复
   * 内容是字符串直接返回
   * 内容是对象转换成 JSON 格式
   * @param {*} ctx
   */
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
