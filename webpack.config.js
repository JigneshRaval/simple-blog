// webpack.config.js
// =================================

const webpack = require('webpack'); //to access built-in plugins
// const compiler = new webpack.Compiler();
const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ConvertMarkdown = require('./configs/markdown-convertor');
// const HelloWorld = require('./configs/hello-world.plugin');
const MarkDownConvertor = require('./configs/markdown-convertor.plugin');
const myTest = require('./configs/example')

const converter = new showdown.Converter();
// converter.setOption('ghCompatibleHeaderId', false);
converter.setOption('ghCompatibleHeaderId', true);

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
const categoriesTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/categories.${TEMPLATE_TYPE}`);

// let markdownFileList = ConvertMarkdown();
let markdownFileListTemp = new MarkDownConvertor();
let markdownFileList = markdownFileListTemp.compileMarkdownFiles();

let postLists = [];

// Generate index pages for posts matching by Tags
// ====================================================
let tags = [], uniqueTags = [];
markdownFileList.map(({ frontmatter }, index) => {
    postLists.push(frontmatter.attributes);
    tags.push(...frontmatter.attributes.tags);
    uniqueTags = [...new Set(tags)];
});

const pagesByTags = (tag) => {
    return new HtmlWebpackPlugin({
        inject: true,
        title: 'Post list by tag',
        template: './src/templates/handlebars/posts-by-tag.handlebars',
        filename: `pages/${tag.toLowerCase()}/index.html`, //relative to root of the application
        header: headerTemplate,
        footer: footerTemplate,
        posts: postLists.filter(post => {
            if (post.tags.includes(tag)) {
                return post
            }
        })
    })
};


// Generate index pages for posts matching by Tags
// ====================================================
let categories = [], uniqueCategories = [];
markdownFileList.map(({ frontmatter }, index) => {
    categories.push(frontmatter.attributes.category.toLowerCase());
    uniqueCategories = [...new Set(categories)];
});

const pagesByCategories = (category) => {
    return new HtmlWebpackPlugin({
        inject: true,
        title: 'Post list by Category',
        template: './src/templates/handlebars/posts-by-category.handlebars',
        filename: `pages/${category.toLowerCase()}/index.html`, //relative to root of the application
        header: headerTemplate,
        footer: footerTemplate,
        posts: postLists.filter(post => {
            if (post.category.toLowerCase() === category) {
                return post
            }
        })
    })
};


/* START : Webpack 4 configuration Object */
module.exports = {
    context: __dirname,
    mode: 'development',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: ['node_modules']
    },
    entry: {
        vendor: './src/vendor.ts',
        // vendor: ['./src/assets/js/jquery.js', './src/assets/js/popper.min.js', './src/assets/js/bootstrap.js'],
        // vendor: ['jquery', 'popper.js', 'bootstrap'],
        app: './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
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
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts/'
                    }
                }]
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
        minimize: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                default: false,
                /* vendor: {
                    chunks: 'all',
                    name: 'vendor',
                    reuseExistingChunk: true,
                    test(chunks) {
                        return chunks.resource && (chunks.resource.startsWith(__dirname + '\\src\\assets\\js'));
                    }
                } */
            }
        }
    },
    devtool: "source-map",
    plugins: [
        /* new HelloWorld({
            test: () => {
                console.log('TEST OPTION =============');
            }
        }), */
        // myTest(),


        new HtmlWebpackPlugin({
            title: 'My Plugin DEmo page 111',
            template: './src/templates/handlebars/index.handlebars',
            filename: 'pages/test1100.html', //relative to root of the application
        }),

        // TODO : Find solution to run HtmlWebpackPlugin from inside this plugin
        new MarkDownConvertor({
            title: 'Replacement title',
            test: (data) => {
                markdownFileList = data;
            }
        }),

        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/templates/handlebars/index.handlebars',
        }),

        // Copy all the static files like images, html, fonts etc.., from SRC folder to DIST folder
        new CopyWebpackPlugin([
            { from: './server.js', to: './' },
            { from: './index.html', to: './' },
            // { from: './src/pages/**/*.html', to: './pages/[name].[ext]' },
            { from: './src/assets/js/highlight.pack.js', to: 'assets/js' },
            {
                from: './src/assets/images',
                to: 'assets/images',
                ignore: ['*.scss']
            },
            {
                from: './src/assets/fonts',
                to: 'assets/fonts',
                ignore: ['*.scss']
            }
        ], { debug: 'info' }),

        // Extract CSS from javascript file and put it into another CSS file in dist folder
        new ExtractTextPlugin({
            // define where to save the file
            filename: 'assets/css/[name].bundle.css',
            allChunks: true
        }),

        ...markdownFileListTemp.compileMarkdownFiles().map(({ fileName, filePath, frontmatter }, index) => {
            return (
                new HtmlWebpackPlugin({
                    inject: true,
                    title: frontmatter.attributes.title,
                    template: './src/templates/handlebars/article.handlebars',
                    filename: `${filePath}.html`, //relative to root of the application
                    path: filePath,
                    header: headerTemplate,
                    footer: footerTemplate,
                    categories: categoriesTemplate,
                    post: frontmatter.attributes,
                    // Parses the markdown string and converts to HTML string
                    bodyHTML: converter.makeHtml(frontmatter.body)
                })
            )
        }),



        // Generate Template for each .md files
        /* ...markdownFileList.map(({ fileName, filePath, fileNameWithoutExt, markdown, frontmatter }, index) => {
            // console.log(fileName, '==========', filePath)

            return (
                new HtmlWebpackPlugin({
                    inject: true,
                    title: frontmatter.attributes.title,
                    template: './src/templates/handlebars/article.handlebars',
                    filename: `${filePath}.html`, //relative to root of the application
                    path: filePath,
                    header: headerTemplate,
                    footer: footerTemplate,
                    categories: categoriesTemplate,
                    post: frontmatter.attributes,
                    // Parses the markdown string and converts to HTML string
                    bodyHTML: converter.makeHtml(frontmatter.body)
                })
            )
        }), */

        function generatePostListJson() {
            var obj = {
                posts: postLists
            };

            fs.writeFile('./dist/posts.json', JSON.stringify(obj), 'utf8');
        },

        // Generate pages to display list of Posts filtered by Tags
        ...uniqueTags.map(pagesByTags),

        // Generate pages to display list of Posts filtered by Category
        // ...uniqueCategories.map(pagesByCategories),

        // Generate Template for Index.html in root folder
        // This page will display list of all the posts
        new HtmlWebpackPlugin({
            inject: true,
            title: 'My awesome service',
            template: './src/templates/handlebars/index.handlebars',
            filename: `${__dirname}/dist/index.html`, //relative to root of the application
            header: headerTemplate,
            footer: footerTemplate,
            categories: categoriesTemplate,
            posts: postLists,
            firstName: 'Simple',
            lastName: 'Blog'
        }),

        new HtmlWebpackPlugin({
            inject: true,
            title: 'HTML to Markdown conversion',
            template: './src/templates/handlebars/html-to-markdown.handlebars',
            filename: `${__dirname}/dist/html-to-markdown.html`, //relative to root of the application
            header: headerTemplate,
            footer: footerTemplate
        }),

    ],
    devServer: {
        contentBase: "dist",
        watchContentBase: true,
        clientLogLevel: "none",
        // publicPath: "/dist/",
        compress: true,
        // host: 'localhost',
        port: 4000,
        stats: 'errors-only',
        // hot: true,
        watchOptions: {
            aggregateTimeout: 3000,
            poll: 1500
        },
        historyApiFallback: true
    },
};
