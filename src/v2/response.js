/**
 * 封装 Node 原生 response
 */

module.exports = {
  get body() {
    return this._body
  },

  /**
   * 设置返回的内容
   * @param {String|Object}
   */
  set body(data) {
    this._body = data
  },

  get status() {
    return this.res.statusCode
  },

  /**
   * 设置返回的状态码
   * @param {Number}
   */
  set status(statusCode) {
    if (typeof statusCode !== 'number') {
      throw new Error('statusCode must be a number!')
    }
    this.res.statusCode = statusCode
  }
}
