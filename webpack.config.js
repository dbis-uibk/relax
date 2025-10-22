/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, options) => {
	const mode = (
		options
			? options.mode
			: env.mode
	);
	const isProduction = (mode !== 'development');

	console.log(`build-mode: ${mode}`);

	return {
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					uglifyOptions: {
						keep_fnames: true,
						keep_classnames: true
					}
				})
			]
		},
		mode: isProduction ? 'production' : 'development',
		entry: {
			'calc': [
				'./src/calc2/calculator.entry.tsx',
			],
			'tests': [
				'./src/db/tests/tests.entry.ts',
			],
		},
		output: {
			path: __dirname + "/dist/",
			filename: isProduction ? "js/[name].[hash].bundle.js" : "js/[name].bundle.js",
			publicPath: isProduction ? "/relax/" : "/",
		},

		devtool: isProduction ? '' : 'cheap-module-eval-source-map',
		plugins: [
			// https://github.com/johnagan/clean-webpack-plugin
			new CleanWebpackPlugin({
				dry: !isProduction,
				verbose: false,
			}),

			// generate index.html
			new HtmlWebpackPlugin({
				title: 'relational algebra calculator',
				template: 'src/calc2/index.ejs',
				excludeAssets: [/test.*.(js|css)/],
			}),
			// generate test.html
			new HtmlWebpackPlugin({
				filename: 'test.html',
				template: 'src/db/tests/test.ejs',
				excludeAssets: [/calc.*.(js|css)/],
			}),

			new HtmlWebpackExcludeAssetsPlugin(),

			new MiniCssExtractPlugin({
				filename: !isProduction ? '[name].css' : '[name].[hash].css',
				chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css',
			}),

			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery",
				"window.$": "jquery",
			}),

			// https://webpack.js.org/plugins/named-modules-plugin/
			new webpack.NamedModulesPlugin(),

			new webpack.EnvironmentPlugin({
				'NODE_ENV': isProduction ? 'production' : 'development',
			}),

			// https://github.com/webpack-contrib/zopfli-webpack-plugin
			(isProduction
				? new CompressionPlugin({
					test: /\.*/,
					algorithm: 'gzip',
					threshold: 0,
					minRatio: 0.8,
					cache: true,
					deleteOriginalAssets: false,
				})
				: null
			),

			// https://github.com/kevlened/copy-webpack-plugin
			new CopyWebpackPlugin([
				{ from: 'src/calc2/manifest.json', to: './' },
				{ from: 'resources/favicon/*', to: './assets/favicon/', flatten: true },
				{ from: 'resources/logos/*', to: './assets/logos/', flatten: true },
			]),

			new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				reportFilename: '../reports/report.html',
				defaultSizes: 'parsed',
				openAnalyzer: false,
				logLevel: 'info',
			}),
		].filter(e => !!e),
		resolve: {
			extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html'],
			modules: [
				path.join(__dirname, "src"),
				'node_modules',
			],
		},
		module: {
			rules: [
				{
					test: /\.(htm|html)$/,
					loader: 'file-loader',
					options: {
						'name': '[name].[ext]',
						'outputPath': './',
					},
				},
				{
					test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
					loader: 'file-loader',
					options: {
						'name': isProduction ? '[name].[hash].[ext]' : '[name].[ext]',
						'outputPath': './assets/',
					},
				},
				{
					test: /\.(txt)$/,
					loader: 'raw-loader',
				},
				{
					// https://github.com/eploko/pegjs-loader
					test: /grammar_ra\.pegjs$/,
					loader: 'pegjs-loader?cache=true&trace=false&allowedStartRules[]=start,allowedStartRules[]=groupStart',
				},
				{
					// https://github.com/eploko/pegjs-loader
					test: /grammar_bags\.pegjs$/,
					loader: 'pegjs-loader?cache=true&trace=false&allowedStartRules[]=start,allowedStartRules[]=groupStart',
				},
				{
					// https://github.com/eploko/pegjs-loader
					test: /grammar_sql\.pegjs$/,
					loader: 'pegjs-loader?cache=true&trace=false&allowedStartRules[]=start&allowedStartRules[]=dbDumpStart',
				},
				{
					// https://github.com/eploko/pegjs-loader
					test: /grammar_trc\.pegjs$/,
					loader: 'pegjs-loader?cache=true&trace=false&allowedStartRules[]=start&allowedStartRules[]=dbDumpStart',
				},
				{
					test: /\.worker\.(js|ts)$/,
					use: { loader: "worker-loader" },
				},
				{
					// normal js and ts code
					test: /\.(ts|tsx|js|jsx)?$/,
					exclude: /(node_modules|bower_components)/,
					loader: [
						{
							loader: 'ts-loader',
							options: {
								onlyCompileBundledFiles: true,
							}
						},
					],
				},
				{
					test: /\.(css|scss)$/,
					use: [
						!isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
						},
						{
							loader: 'sass-loader',
						},
					],
				},
				{
					// use json5 loader to allow single and double line comments in json files
					test: /\.(json5)?$/,
					use: [
						'json5-loader',
					],
				},
			]
		},

		devServer: {
			contentBase: path.join(__dirname, "dist"),
			port: 8088,
			clientLogLevel: 'info',
			compress: true,
			headers: {
				//"X-Custom-Foo": "bar"
			},
			hotOnly: true,
			/*proxy: {
				"/relax": {
					target: "http://localhost:8080",
					pathRewrite: {"^/relax" : ""}
				}
			},*/
			historyApiFallback: {
				verbose: true,
				//index: '404.html',
				disableDotRule: true, // to get redirected from help.htm
			},
			//https: true,
		}
	}
};