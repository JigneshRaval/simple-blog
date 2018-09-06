const webpack = require('webpack'); //to access built-in plugins
const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ConvertMarkdown = require('./configs/markdown-convertor');
const converter = new showdown.Converter();
const headerTemplate = fs.readFileSync(__dirname + '/src/templates/header.html');
const footerTemplate = fs.readFileSync(__dirname + '/src/templates/footer.html');

let test = ConvertMarkdown();

const makeHtmlConfig = ({ filename, markdown, frontmatter }, index) => (
    new HtmlWebpackPlugin({
        cache: true,
        chunks: ['main'],
        template: './src/index.html',
        filename: `pages/${filename}.html`, //relative to root of the application
        title: frontmatter.attributes.title,
        header: headerTemplate,
        footer: footerTemplate,
        // Parses the markdown string and converts to HTML string
        bodyHTML: converter.makeHtml(frontmatter.body)
    })
);
// console.log('TEsT ::', test);

const myTest = () => {
    console.log('DireName :', __dirname);
}

module.exports = {
    entry: {
        'app': './src/main.ts',
        //vendor: ['jquery', 'bootstrap'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js',
        //chunkFilename: "[id].chunk.js",
        libraryTarget: "umd", // universal module definition
    },
    module: {
        rules: [
            {
                // sass / scss loader for webpack
                test: /\.(sass|scss)$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]
                })
            },
            // Compile .ts files written in ES6+
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    performance: {
        hints: false
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all',
            name: true,
            /* name(module) {
                console.log('RXJS :::', module.resource, '====', module.resource && module.resource.startsWith('\\assets\\js\\'));

			    return module.resource && (module.resource.startsWith('\\assets\\js\\'));

            }, */

            cacheGroups: {
                vendors: {
                    test: /[\\/]assets\\js[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                }
                /* vendor: {
                    test(chunks) {
                        console.log('RXJS :::', chunks.resource, '====', chunks.resource && chunks.resource.startsWith(__dirname + '\\src\\assets\\js'));

                        return chunks.resource && (chunks.resource.startsWith(__dirname + '\\src\\assets\\js'));
                    }
                } */
            }
        }
    },
    devtool: "source-map",
    plugins: [

        // Copy all the static files like images, html, fonts etc.., from SRC folder to DIST folder
        new CopyWebpackPlugin([
            // { from: './index.html', to: './' },
            // { from: './src/pages/**/*.html', to: './pages/[name].[ext]' },
            { from: './src/assets/js', to: 'assets/js' },
            {
                from: './src/assets/images',
                to: 'assets/images',
                ignore: ['*.scss']
            }
        ], { debug: 'info' }),

        // Extract CSS from javascript file and put it into another CSS file in dist folder
        new ExtractTextPlugin({
            // define where to save the file
            filename: 'assets/css/[name].bundle.css',
            allChunks: true
        }),
        ...test.map(makeHtmlConfig)
        /* new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: `${__dirname + '/index.html'}`, //relative to root of the application
            header: headerTemplate,
            footer: footerTemplate
        }), */

    ],
    devServer: {
        //contentBase: "dist",
        watchContentBase: true,
        clientLogLevel: "none",
        publicPath: "/dist/",
        compress: true,
        // host: 'localhost',
        port: 3000,
        stats: 'errors-only',
        // hot: true,
        watchOptions: {
            aggregateTimeout: 1500,
            poll: 1000
        },
        historyApiFallback: true
    },
};
