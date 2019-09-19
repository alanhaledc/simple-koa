// 封装 Node 原生 request

const url = require('url')

module.exports = {
  get query() {
    return url.parse(this.req.url, true).query
  }
}
