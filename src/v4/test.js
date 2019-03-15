/**
 * 测试异常机制
 */
const SimpleKoa = require('./application')

const app = new SimpleKoa()

app.use(async ctx => {
  throw new Error('oooops')
})

app.on('error', err => console.log(err.stack))

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/
// 返回 500 和 ‘oooops’
