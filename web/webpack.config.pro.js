var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		bundle: './src/index.js',
		// vendor: ['react', 'react-dom', 'react-redux', 'whatwg-fetch', 'react-d3', 'lodash']
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	externals: {
		'react': 'React',
		'react-dom':'ReactDOM',
		'lodash':'_',
		'antd':'antd'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')},
		}),
		new HtmlWebpackPlugin({
			template: './dist/template.html'
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		// new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
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


