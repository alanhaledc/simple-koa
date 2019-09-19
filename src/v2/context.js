// 代理 request 和 response 模块的属性

const proto = {}

// 代理 getter 属性
function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name]
  })
}

// 代理 setter 属性
function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val
  })
}

// 需要代理的属性名称
const requestGet = ['query']
const requestSet = []

const responseGet = ['body', 'status']
const responseSet = responseGet

requestGet.forEach(element => delegateGet('request', element))
requestSet.forEach(element => delegateSet('request', element))

responseGet.forEach(element => delegateGet('response', element))
responseSet.forEach(element => delegateSet('response', element))

module.exports = proto

// 代理方法 1 不适合代理更多的方法
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
