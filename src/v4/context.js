const proto = {}

function delegateGet(property, name) {
  proto.__defineGetter__(name, function() {
    return this[property][name]
  })
}

function delegateSet(property, name) {
  proto.__defineSetter__(name, function(val) {
    this[property][name] = val
  })
}

const requestGet = ['query']
const requestSet = []

const responseGet = ['body', 'status']
const responseSet = responseGet

requestGet.forEach(ele => delegateGet('request', ele))
requestSet.forEach(ele => delegateSet('request', ele))

responseGet.forEach(ele => delegateGet('response', ele))
responseSet.forEach(ele => delegateSet('response', ele))

module.exports = proto
