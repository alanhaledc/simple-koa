/**
 * @version v1.0
 * 封装原生 http 模块， 并且暴露 API
 */

const http = require('http')

class Application {
  constructor() {
    this.callbackFn = null
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
   * server 所需的 callback 函数
   * 注意：这里需要传入原生的 req 和 res，使用闭包
   * @returns {Function}
   */
  callback() {
    return (req, res) => this.callbackFn(req, res)
  }
}

module.exports = Application
