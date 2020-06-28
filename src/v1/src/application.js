// @version v1.0
// 封装原生 http 模块，并且暴露 API

const http = require("http");

class Application {
  constructor() {
    this.callbackFn = null;
  }

  // 创建 server，并且传入 callback
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  // 使用单个回调函数
  use(fn) {
    this.callbackFn = fn;
  }

  callback() {
    return (req, res) => this.callbackFn(req, res);
  }
}

module.exports = Application;
