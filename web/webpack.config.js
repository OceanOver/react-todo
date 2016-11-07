var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw', 'autoprefixer-loader'],
      include: __dirname
    }, {
      test: /\.less$/,
      loaders: ['style', 'raw', 'less', 'autoprefixer-loader'],
      include: __dirname
    }, {
      test: /\.(png|jpg|svg)$/,
      loader: 'url-loader?limit=10240&name=[path][name].[ext]',
      include: __dirname
    }]
  }
}
