// REF : https://github.com/carloluis/webpack-demo/blob/master/config/webpack.config.dev.js
// Others related to webpack :
// https://medium.com/dailyjs/webpack-4-splitchunks-plugin-d9fbbe091fd0
// https://medium.freecodecamp.org/webpack-for-the-fast-and-the-furious-bf8d3746adbd
// https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
// Webpack 4 chunking different runtime behaviour compared to Webpack 3 : https://github.com/webpack/webpack/issues/6647
// https://stackoverflow.com/questions/49163684/how-to-configure-webpack-4-to-prevent-chunks-from-list-of-entry-points-appearing
// https://medium.com/@hpux/webpack-4-in-production-how-make-your-life-easier-4d03e2e5b081
// https://wanago.io/2018/06/04/code-splitting-with-splitchunksplugin-in-webpack-4/



const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist')
};

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: {
        app: [PATHS.src]
	},
    output: {
        path: PATHS.dist,
        filename: '[name].js',
        publicPath: '/'
	},
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all'
				}
			}
		}
	},
    resolve: {
        extensions: ['.js', '.jsx', '.jsm'],
        alias: {
            styles: path.resolve(__dirname, '../src/styles')
		}
	},
    devtool: 'eval-sourcemap',
    module: {
        rules: [
            {
                test: /.scss$/,
                use: [
                    {
                        loader: 'style-loader'
					},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            camelCase: 'dashes',
                            localIdentName: '[path][name]__[local]'
						}
					},
                    {
                        loader: 'resolve-url-loader'
					},
                    {
                        loader: 'sass-loader'
					}
				]
			},
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
			},
            {
                test: /\.(jpg|png)$/,
                use: 'file-loader'
			}
		]
	},
    plugins: [
        new HtmlWebpackPlugin({
            template: '../node_modules/html-webpack-template/index.ejs',
            title: 'Webpack 4 Demo',
            favicon: '../src/favicon.ico',
            meta: [
                {
                    name: 'robots',
                    content: 'noindex,nofollow'
				},
                {
                    name: 'description',
                    content: 'Webpack 4 demo using ES6, React, SASS'
				},
                {
                    name: 'keywords',
                    content: 'webpack,webpack-4,webpack.config.js,html5,es6+,react,sass'
				}
			],
            appMountIds: ['app'],
            inject: false,
            minify: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                preserveLineBreaks: true,
                useShortDoctype: true,
                html5: true
			},
            mobile: true,
            scripts: ['/static.js']
		}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(PATHS.src, 'favicon.ico'),
                to: path.join(PATHS.dist, 'favicon.ico')
			},
            {
                from: path.join(PATHS.src, 'demo/static.js'),
                to: path.join(PATHS.dist, 'static.js')
			}
		]),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            VERSION: JSON.stringify('1.2.0'),
            DEBUG: true,
            CODE_FRAGMENT: '80 + 5'
		})
	],
    devServer: {
        contentBase: PATHS.dist,
        compress: true,
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY'
		},
        open: true,
        overlay: {
            warnings: true,
            errors: true
		},
        port: 8080,
        publicPath: 'http://localhost:8080/',
        hot: true
	},
    stats: {
        children: false
	}
};