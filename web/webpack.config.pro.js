var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    bundle: './src/index.js',
    vendor: ['react', 'react-router', 'react-dom', 'react-redux', 'whatwg-fetch', 'react-router-redux','react-d3','lodash',]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
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
