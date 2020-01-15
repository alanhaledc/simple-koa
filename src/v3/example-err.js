// test err

const App = require('./src/application')

const app = new App()

const responseData = {}

app.use(async (ctx, next) => {
  responseData.name = 'hale'
  await next()
  ctx.body = responseData
})

app.use(async (ctx, next) => {
  responseData.age = 30
  await next()
})

app.use(async ctx => {
  responseData.sex = 'male'
  throw new Error('oooops') // 抛出异常
})

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/
// 有异常，没有返回
