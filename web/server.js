var webpack = require('webpack')
/*
 * webpack-dev-middleware是一个处理静态资源的middleware。
 */
var webpackDevMiddleware = require('webpack-dev-middleware')
/*
 * webpack-hot-middleware是一个结合webpack-dev-middleware使用的middleware，
 * 它可以实现浏览器的无刷新更新（hot reload）。
 */
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var cors = require('cors');
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

var options = {
    origin: true
  }
app.use(cors(options))
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/src/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
