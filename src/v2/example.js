const App = require('./src/application')

const app = new App()

app.use(async ctx => (ctx.body = 'hello ' + ctx.query.name))

app.listen(3000, () => console.log('Server running on http://127.0.0.1:3000'))

// 在浏览器中访问 http://127.0.0.1:3000/?name=hale
// 返回 'hello hale'
