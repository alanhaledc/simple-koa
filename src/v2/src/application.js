// @version v2.0
// 封装 Node 原生的 request 和 response
// 使用上下文 context 代理封装好的 request 和 response

const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class Application {
  constructor() {
    this.callbackFn = null;
    this.context = context;
    this.request = request;
    this.response = response;
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  use(fn) {
    this.callbackFn = fn;
  }

  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res);
      const respond = () => this.responseBody(ctx);
      this.callbackFn(ctx).then(respond);
    };
  }

  createContext(req, res) {
    const ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req; // 原生 request
    ctx.res = ctx.response.res = res; // 原生 response
    return ctx;
  }

  responseBody(ctx) {
    const content = ctx.body;
    if (typeof content === "string") {
      ctx.res.end(content);
    } else if (typeof content === "object") {
      ctx.res.end(JSON.stringify(content));
    }
  }
}

module.exports = Application;
