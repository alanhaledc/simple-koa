const App = require('./application')

const app = new App()

app.use(async (ctx, next) => {
  console.log(ctx.path)
  console.log(1)
  await next()
  console.log(6)
  ctx.body = '123456'
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

// 在浏览器中访问 http://127.0.0.1:3000/
// 返回  / 123456 /favicon.ico 123456
