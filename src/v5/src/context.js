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

requestGet.forEach(element => delegateGet('request', element))
requestSet.forEach(element => delegateSet('request', element))

responseGet.forEach(element => delegateGet('response', element))
responseSet.forEach(element => delegateSet('response', element))

module.exports = proto
