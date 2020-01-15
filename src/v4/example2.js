// 测试异常机制

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
  await next() // 抛出错误 ‘next is not defined’
})

// app.on('error', err => console.log(err.stack)) // 捕获错误

// 使用 try catch 捕获错误
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error)
  }
})

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/
// 返回状态码 500 和 ‘next is not defined’
