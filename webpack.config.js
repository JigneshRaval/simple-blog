// webpack.config.js
// =================================

const webpack = require('webpack'); //to access built-in plugins
const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
const categoriesTemplate = fs.readFileSync(`${PATHS.templates}/${TEMPLATE_TYPE}/categories.${TEMPLATE_TYPE}`);

let markdownFileList = ConvertMarkdown();

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
        // Copy all the static files like images, html, fonts etc.., from SRC folder to DIST folder
        new CopyWebpackPlugin([
            // { from: './index.html', to: './' },
            // { from: './src/pages/**/*.html', to: './pages/[name].[ext]' },
            { from: './src/assets/js/highlight.pack.js', to: 'assets/js' },
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

        // Generate Template for each .md files
        ...markdownFileList.map(({ fileName, filePath, fileNameWithoutExt, markdown, frontmatter }, index) => {
            // postLists.push(frontmatter.attributes);

            return (
                new HtmlWebpackPlugin({
                    inject: true,
                    title: frontmatter.attributes.title,
                    template: './src/templates/handlebars/article.handlebars',
                    filename: `${filePath}.html`, //relative to root of the application
                    header: headerTemplate,
                    footer: footerTemplate,
                    categories: categoriesTemplate,
                    post: frontmatter.attributes,
                    // Parses the markdown string and converts to HTML string
                    bodyHTML: converter.makeHtml(frontmatter.body)
                })
            )
        }),

        function generatePostListJson() {
            var obj = {
                posts: postLists
            };

            fs.writeFile('posts.json', JSON.stringify(obj), 'utf8');
        },
        /*  new HtmlWebpackPlugin({
             inject: true,
             title: 'Post list by tags 123',
             template: './src/templates/handlebars/posts-by-tag.handlebars',
             filename: `pages/${tag}/index.html`, //relative to root of the application
             header: headerTemplate,
             footer: footerTemplate,
             posts: postLists.filter(post => {
                 if (post.tags.includes(tag)) {
                     return post
                 }
             })
         }), */

        ...uniqueTags.map(pagesByTags),

        // ...uniqueCategories.map(pagesByCategories),

        // Generate Template for Index.html in root folder
        new HtmlWebpackPlugin({
            inject: true,
            title: 'My awesome service',
            template: './src/templates/handlebars/index.handlebars',
            filename: `${__dirname}/index.html`, //relative to root of the application
            header: headerTemplate,
            footer: footerTemplate,
            categories: categoriesTemplate,
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
