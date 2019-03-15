// koa-compose core code
function compose(middleware) {
  return function(context, next) {
    return dispatch(0)
    function dispatch(i) {
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return null
      return fn(context, dispatch.bind(null, i + 1))
    }
  }
}

// test
async function m1(ctx, next) {
  console.log('m1')
  await next()
}

async function m2(ctx, next) {
  console.log('m2')
  await next()
}

async function m3(ctx, next) {
  console.log('m3')
  await next()
}

const middleware = [m1, m2, m3]
const fn = compose(middleware)
fn()
