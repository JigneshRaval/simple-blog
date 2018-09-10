const webpack = require('webpack'); //to access built-in plugins
const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ConvertMarkdown = require('./configs/markdown-convertor');
const converter = new showdown.Converter();


const PATHS = {
    src: __dirname + '/src',
    dist: __dirname + '/dist',
    templates: __dirname + '/src/templates',
}

// HTML Templates
const TEMPLATE_TYPE = 'handlebars'; // handlebars, ejs, html

const indexTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/index.${TEMPLATE_TYPE}`);
const headerTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/header.${TEMPLATE_TYPE}`);
const footerTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/footer.${TEMPLATE_TYPE}`);

let test = ConvertMarkdown();

let postLists = [];

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: {
        vendor: './src/vendor.ts',
        // vendor: ['./src/assets/js/jquery.js', './src/assets/js/popper.min.js', './src/assets/js/bootstrap.js'],
        // vendor: ['jquery', 'popper.js', 'bootstrap'],
        app: './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js',
        chunkFilename: "[name].bundle.js",
        libraryTarget: "umd", // universal module definition
    },
    module: {
        rules: [
            {
                // SCSS Compilation : sass / scss loader for webpack
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
            // Typescript Compilation : Compile .ts files written in ES6+
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(handlebars|hbs)$/i,
                loader: "handlebars-loader"
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    performance: {
        hints: false
    },
    optimization: {
        occurrenceOrder: false,
        minimize: false,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                default: false,
                /* vendor: {
                    chunks: 'all',
                    name: 'vendor',
                    reuseExistingChunk: true,
                    test(chunks) {
                        console.log('VENDOR === :::', chunks.resource, '====', chunks.resource && chunks.resource.startsWith(__dirname + '\\src\\assets\\js'));

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
            /* { from: './src/assets/js', to: 'assets/js' },
            {
                from: './src/assets/images',
                to: 'assets/images',
                ignore: ['*.scss']
            } */
        ], { debug: 'info' }),

        // Extract CSS from javascript file and put it into another CSS file in dist folder
        new ExtractTextPlugin({
            // define where to save the file
            filename: 'assets/css/[name].bundle.css',
            allChunks: true
        }),

        // Generate Template for each .md files
        ...test.map(({ filename, fileNameWithoutExt, markdown, frontmatter }, index) => {
            console.log('frontmatter.attributes === ', frontmatter.attributes);
            postLists.push(frontmatter.attributes);
            return (
                new HtmlWebpackPlugin({
                    cache: false,
                    chunks: ['main'],
                    template: './src/templates/handlebars/index.handlebars',
                    filename: `pages/${fileNameWithoutExt}.html`, //relative to root of the application
                    title: frontmatter.attributes.title,
                    header: headerTemplate,
                    footer: footerTemplate,
                    post: frontmatter.attributes,
                    // Parses the markdown string and converts to HTML string
                    bodyHTML: converter.makeHtml(frontmatter.body)
                })
            )
        }),
        // Generate Template for Index.html in root folder
        new HtmlWebpackPlugin({
            inject: false,
            title: 'My awesome service',
            template: './src/templates/handlebars/index.handlebars',
            filename: `${__dirname}/index.html`, //relative to root of the application
            header: headerTemplate,
            footer: footerTemplate,
            posts: postLists,
            firstName: 'Simple',
            lastName: 'Blog'
        }),

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
            aggregateTimeout: 2500,
            poll: 3000
        },
        historyApiFallback: true
    },
};
