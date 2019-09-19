// 测试异常机制

const App = require('./application')

const app = new App()

app.use(async ctx => {
  throw new Error('oooops')
})

app.on('error', error => console.log(error.stack))

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/
// 返回 500 和 ‘oooops’
