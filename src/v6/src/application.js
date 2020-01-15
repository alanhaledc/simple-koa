// @version v6.0
// 改进 context 的代理方式

const Emitter = require('events')
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application extends Emitter {
  constructor() {
    super()
    this.middlewares = []
    this.context = context
    this.request = request
    this.response = response
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  compose(middlewares) {
    return function(context, next) {
      return dispatch(0)
      function dispatch(i) {
        let fn = middlewares[i]
        if (i === middlewares.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }
  }

  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx)
      const onerror = err => this.onerror(err, ctx)
      const fn = this.compose(this.middlewares)
      return fn(ctx)
        .then(respond)
        .catch(onerror)
    }
  }

  createContext(req, res) {
    const ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }

  responseBody(ctx) {
    const content = ctx.body
    if (typeof content === 'string') {
      ctx.res.end(content)
    } else if (typeof content === 'object') {
      ctx.res.end(JSON.stringify(content))
    }
  }

  onerror(err, ctx) {
    if (err.code === 'ENOENT') {
      ctx.status = 404
    } else {
      ctx.status = 500
    }
    const msg = err.message || 'Internal Error'
    ctx.res.end(msg)
    this.emit('error', err)
  }
}

module.exports = Application
