var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./src/index.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')},
		}),
		new HtmlWebpackPlugin({
			template: './dist/dev.html',
			inject: 'body',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new ExtractTextPlugin('[name].css'),
		new ExtractTextPlugin('[name].less')
	],
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', '!css-loader!postcss-loader'),
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style-loader', '!css-loader!postcss-loader!less-loader'),
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ['babel'],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				loader: 'url-loader?prefix=img/&limit=10000',
			},
		]
	},
	postcss: [autoprefixer],
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}
