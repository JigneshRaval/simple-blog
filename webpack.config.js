// const webpack = require('webpack'); //to access built-in plugins
const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Markdown file converter
const showdown = require('showdown');
const converter = new showdown.Converter();

// Assuming I add a bunch of .md files in my ./md dir.
const MARKDOWN_FILE_DIR = './src/pages';
const MARKDOWN_OUTPUT_DIR = './dist/pages/';
const ASSETS_PATH = './src/assets'

// Check if MARKDOWN_OUTPUT_DIR is exist, if not then create directory first
if (!fs.existsSync(MARKDOWN_OUTPUT_DIR)) {
    fs.mkdirSync('dist');
    fs.mkdirSync(MARKDOWN_OUTPUT_DIR);
}


/*
* Generates an Array with the following data:
* [
*   {
*     filename: '{markdownFilename}.md',
*     markdown: '{ markdownString }`
*   }
* ]
*/
const markdownFilesData = fs
    // Read directory contents
    .readdirSync(MARKDOWN_FILE_DIR)
    // Take only .md files
    .filter(filename => /\.md$/.test(filename))
    // Normalize file data.
    .map(filename => {
        let fileNameWithoutExt = filename.split('.')[0];
        return {
            markdown: fs.readFileSync(
                path.join(MARKDOWN_FILE_DIR, fileNameWithoutExt + '.md'), "utf8"
            ),
            filename,
            fileNameWithoutExt
        }
    });


markdownFilesData.map((data) => {
    let html = converter.makeHtml(data.markdown);
    fs.writeFile(`./dist/pages/${data.fileNameWithoutExt + '.html'}`, html, function (err, data) {
        if (err) console.log(err);
    });
})


/*
const makeHtmlConfig = ({ filename, markdown }) => ({
    template: 'pug!templates/index.pug',
    cache: true,
    chunks: [ 'main' ],
    title: `Page Number ${n}`,
    filename: `pages/${filename}.html`,
    // Parses the markdown string and converts to HTML string
    bodyHTML: marked(markdown)
}); */


module.exports = {
    entry: {
        'app': './src/main.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js'
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
    devtool: "source-map",
    plugins: [
        // Copy all the static files like images, html, fonts etc.., from SRC folder to DIST folder
        new CopyWebpackPlugin([
            // { from: './index.html', to: './' },
            // { from: './src/pages/**/*.html', to: './pages/[name].[ext]' },
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

        /* new HtmlWebpackPlugin({
            inject: false,
            // hash: true,
            template: './index.html',
            filename: 'index.html'
        }) */
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
            poll: 1500
        },
        historyApiFallback: true
    },
};
