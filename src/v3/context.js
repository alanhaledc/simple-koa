/**
 * 代理 request 和 response 模块的属性
 */

const proto = {}

/**
 * 代理 getter 属性
 * @param {*} property
 * @param {*} name
 * @returns {*}
 */
function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name]
  })
}

/**
 * 代理 setter 属性
 * @param {*} property
 * @param {*} name
 */
function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val
  })
}

// 需要代理的属性名称，下同
const requestGet = ['query', 'path'] // 后续可以在数组中添加更多要代理的属性，但需要提前在 request 和 response 模块中配置好， 下同
const requestSet = []

const responseGet = ['body', 'status']
const responseSet = responseGet

requestGet.forEach(ele => delegateGet('request', ele))
requestSet.forEach(ele => delegateSet('request', ele))

responseGet.forEach(ele => delegateGet('response', ele))
responseSet.forEach(ele => delegateSet('response', ele))

module.exports = proto

// 代理方法1 不适合代理更多的方法
// module.exports = {
//   get query() {
//     return this.request.query
//   },

//   get body() {
//     return this.response.body
//   },

//   set body(data) {
//     this.response.body = data
//   },

//   get status() {
//     return this.response.status
//   },

//   set status(statusCode) {
//     this.response.status = statusCode
//   }
// }
