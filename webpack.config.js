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
console.log('PATHS :', PATHS)


// HTML Templates
const TEMPLATE_TYPE = 'handlebars'; // handlebars, ejs, html

const indexTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/index.${TEMPLATE_TYPE}`);
const headerTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/header.${TEMPLATE_TYPE}`);
const footerTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/footer.${TEMPLATE_TYPE}`);

let test = ConvertMarkdown();

/* const makeHtmlConfig = ({ filename, markdown, frontmatter }, index) => (
    new HtmlWebpackPlugin({
        cache: false,
        chunks: ['main'],
        template: './src/templates/handlebars/index.handlebars',
        filename: `pages/${filename}.html`, //relative to root of the application
        title: frontmatter.attributes.title,
        header: headerTemplate,
        footer: footerTemplate,
        // Parses the markdown string and converts to HTML string
        bodyHTML: converter.makeHtml(frontmatter.body)
    })
); */
// console.log('TEsT ::', test);

const myTest = () => {
    console.log('======================= postLists :', postLists);
}
let postLists = [];

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: {
        main: [
            './src/vendor.ts',
            './src/main.ts'
        ],
        //vendor: ['./src/assets/js/jquery.js', './src/assets/js/bootstrap.js'],
        // app: './src/main.ts'
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
        occurrenceOrder: true,
        minimize: true,
        splitChunks: {
            chunks: 'all',
            /*  name(module) {
                 console.log('RXJS :::', module.resource, '====', module.resource && module.resource.startsWith('\\assets\\js\\'));

                 return module.resource && (module.resource.startsWith('\\assets\\js\\'));

             }, */
            cacheGroups: {
                /* vendor: {
                    test: /[\\/]assets\\js[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                    enforce: true
                }, */
                /* vendor: {
                    test: (module, chunks) => {
                        const names = chunks
                            .map(c => {
                                console.log('C :::', c, c.name);
                                return c.name
                            })
                            .filter(Boolean);
                        console.log('names ===> ', names);
                        return names.some(name => name === 'vendor');
                    },
                    name: "vendor",
                    chunks: "all",
                    minChunks: 1,
                    minSize: 0,
                }, */
                /* vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true
                }, */
                /* vendors: {
                    test: /[\\/]assets\\js[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                } */
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
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery"
        }),
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
        /* new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: `${__dirname}/index.html`, //relative to root of the application
            header: headerTemplate,
            footer: footerTemplate
        }), */
        // Generate Template for each .md files
        ...test.map(({ filename, markdown, frontmatter }, index) => {
            console.log('frontmatter.attributes ::: === ', frontmatter.attributes);
            postLists.push(frontmatter.attributes);
            return (

                new HtmlWebpackPlugin({
                    cache: false,
                    chunks: ['main'],
                    template: './src/templates/handlebars/index.handlebars',
                    filename: `pages/${filename}.html`, //relative to root of the application
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
