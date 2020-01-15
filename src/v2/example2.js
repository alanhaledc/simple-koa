// test 扩展

const App = require('./src/application')

const app = new App()

// 扩展 context
app.context.echoData = function(errno = 0, data = null, errMsg = '') {
  // 使用原生 res 扩展 context
  this.res.setHeader('Content-Type', 'application/json;charset=utf8')
  this.body = {
    errno,
    data,
    errMsg
  }
}

app.use(async ctx => {
  const data = {
    name: 'hale',
    age: 18,
    sex: 'male'
  }
  ctx.echoData(0, data, 'success')
})

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/
// 返回 { errno: 0, data: {name: 'hale', age: 18, sex: 'male'}, errMsg: 'success' }
