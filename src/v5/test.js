/**
 * 测试 koa2 的中间机制
 */
const SimpleKoa = require('./application')

const app = new SimpleKoa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(6)
})

app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log(5)
})

app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))
