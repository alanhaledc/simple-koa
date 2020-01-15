// 测试中间件机制

const App = require('./src/application')

const app = new App()

const responseData = {}

app.use(async (ctx, next) => {
  responseData.name = 'hale'
  await next()
  ctx.body = responseData
})

app.use(async (ctx, next) => {
  responseData.age = 18
  await next()
})

app.use(async ctx => {
  responseData.sex = 'male'
})

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/
// 返回 { name: "hale", age: 18, sex: "male"}
