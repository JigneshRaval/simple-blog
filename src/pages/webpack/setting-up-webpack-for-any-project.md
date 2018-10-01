---
path: "Webpack/setting-up-webpack-for-any-project"
date: "2018-10-01"
title: "Setting up webpack for Any Project"
tags: ["Webpack"]
category: "Webpack"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://scotch.io/tutorials/setting-up-webpack-for-any-project"
type: "Post"
---

Most developers have interacted with [webpack](https://webpack.js.org/) while creating React projects and most see it as a tool for use in developing React projects rather than a general development tool.

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/UsIrFFPwStmuuAaidk7k_Screen%20Shot%202017-11-30%20at%204.28.18%20AM.png)

webpack is a powerful module bundler that can be very efficient if used correctly.

In this tutorial, we will explore how to setup a project using wepback right from the folder structure to exploring different loaders, plugins and other interesting features that come with webpack. This will give you a different perspective to webpack and you will help in setting up future Javascript projects using webpack.

[Why webpack?](#toc-why-webpack-)
---------------------------------

An alternative to using `webpack` is using a combination of a task runner like `grunt` or `gulp` with a bundler like `browserify`. But what makes a developer opt for `webpack` rather than use the task runners?

Webpack attacks the build problem in a fundamentally more integrated and opinionated manner. In `browserify`, you use `gulp/grunt` and a long list of transforms and plugins to get the job done. webpack offers enough power out of the box that you typically don’t need `grunt` or `gulp` at all.

webpack is also configuration based unlike `gulp/grunt` where you have to write code to do your tasks. What makes it even better is the fact that it makes correct assumptions about what you want to do; work with different JS modules, compile code, manage assets and so forth.

The **live-reload ability is also blazing fast**. The ability to substitute output filenames with hash filenames enables browsers to easily detect changed files by including build-specific hash in the filename.

Splitting of file chunks and extracting webpack's boilerplate and manifest also contibutes to fast rebuilds. These are just some few highlights out of many that make webpack a better choice.

### webpack Features

The main webpack features which we will discuss further include:

*   Loaders
*   Plugins
*   Use of different configurations for different environments
*   Lazy loading of split chunks
*   Dead code elimination by tree shaking
*   Hot module replacement that allows code to be updated at runtime without the need for a full refresh
*   Caching by substituting filenames with hash filenames

[Project Setup](#toc-project-setup)
-----------------------------------

### Prerequisites

To continue with this tutorial we will require [Node JS](https://nodejs.org/en/) on our machines which comes bundled with the node package manager(npm). We will then install [yarn](https://yarnpkg.com/en/) which is an alternative to npm that gives us additional functionalities and more speed during installation of packages.

```SH
$ npm install -g yarn
```

### Directory Structure

We will begin by creating the following directory structure: ![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/zTOY80jURs6tpreDV2Si_Screen%20Shot%202017-11-07%20at%204.35.45%20AM.png)

Inside our main directory `webpack-setup`, we initialize our project with `yarn init` which will create for us `package.json` file. We will briefly explore what some of the directories and files will be used for.

*   **src**: Main project container.
*   **src/app**: Will host our javacript files.
*   **src/public**: Holds project assets and static files.
*   **src/style**: Holds the project's global styles.
*   **src/app/index.js**: Main entry point into our project.
*   **src/public/index.html**: Main project template.

[Initial Configuration](#toc-initial-configuration)
---------------------------------------------------

We will start by creating a simple webpack configuration that we will gradually develop by adding more functionality. This simple configuration will only contain one very important plugin, `HtmlWebpackPlugin`.

The `HtmlWebpackPlugin` simplifies creation of HTML files to serve your webpack bundles and can automatically inject our javascript bundle into our main HTML template. But before that, we will need to install some required modules; `webpack` which is the main bundler and `webpack-dev-server` that provides a simple light weight server for development purposes.

```sh
$ yarn add webpack webpack-dev-server html-webpack-plugin -D
```

The initial configuration presents a skeleton of our project with the following parts. You may follow the links to explore the different options available.

*   [entry](https://webpack.js.org/concepts/#entry) - Indicates which module webpack should use to begin building out its internal dependency graph.
*   [output](https://webpack.js.org/concepts/#output) - Tells webpack where to emit the bundles it creates and how to name these files.
*   [devServer](https://webpack.js.org/configuration/dev-server/#devserver) - Set of options to be used by [webpack-dev-server](https://github.com/webpack/webpack-dev-server).

We will explore more on plugins and loaders(module section).

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin

module.exports = {
  entry: __dirname + "/src/app/index.js", // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'bundle.js',  // Name of generated bundle after build
    publicPath: '/' // public URL of the output directory when referenced in a browser
  },
  module: {  // where we defined file patterns and their loaders
      rules: [ 
      ]
  },
  plugins: [  // Array of plugins to apply to build chunk
      new HtmlWebpackPlugin({
          template: __dirname + "/src/public/index.html",
          inject: 'body'
      })
  ],
  devServer: {  // configuration for webpack-dev-server
      contentBase: './src/public',  //source of static assets
      port: 7700, // port to run dev-server
  } 
};
```

`HtmlWebpackPlugin` basically informs webpack to include our javascript bundle in the body element of the provided template file. We will then add a simple statement in `src/app/index.js` and also populate our `src/public/index.html` file with simple HTML for demonstration. We then update `package.json` script with a start script.

```json
"scripts": {
    "start": "webpack-dev-server --history-api-fallback --inline --progress"
  }
```

The above script will enable our server to server `index.html` in case of a `404` error and the `--inline` option allows for injection of a Hot Module Replacement script in our bundle while the `--progres` option simply shows console outputs of the running tasks. We can then start our application with:

```sh
$ yarn start
```

Looking at our console, we find the following logs which basically explain the `devServer` section.

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/tENFbsZNRW2bp76Ck5Wv_Screen%20Shot%202017-11-08%20at%204.46.42%20AM.png)

We can then navigate to [http://localhost:7700/](http://localhost:7700/) to see our application.

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/HoSXr9vHQs6BhLMRHFmr_Screen%20Shot%202017-11-09%20at%202.55.59%20AM.png)

[Loaders](#toc-loaders)
-----------------------

Loaders are special modules webpack uses to ‘load’ other modules (written in another language) into Javascript. They allow us to pre-process files as we import or “load” them.

Thus, loaders are kind of like “tasks” in other build tools, and provide a powerful way to handle front-end build steps.

Loaders can transform files from a different language (like TypeScript) to JavaScript, or `sass` to `css`. They can even allow us to do things like import CSS and HTML files directly into our JavaScript modules. Specifying loaders in our configuration's `module.rules` section is the recommended way of using them.

### babel-loader

This loader uses Babel to load ES2015 files.We install `babel-core` which is the actual babel used by `babel-loader`. We also include `babel-preset-env`; a preset that compiles ES2015+ down to ES5 by automatically determining the Babel plugins and polyfills you need based on your targeted browser or runtime environments.

```sh
$ yarn add babel-core babel-loader babel-preset-env -D
```

We then create a `.babelrc` file where we include the presets.

```json
//.babelrc
{ "presets": [ "env" ] }
```

We can now finally include our loader in our configuration to transform Javascript files. This will now allow us to use ES2015+ syntax in our code.

**Configuration**

```javascript
//webpack.config.js
...
module: {
      rules: [
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: [
              /node_modules/
            ]
          }
      ]
  }
...
```

**Test Case**

```javascript
//src/app/index.js
class TestClass {
    constructor() {
        let msg = "Using ES2015+ syntax";
        console.log(msg);
    }
}

let test = new TestClass();
```

The above snippet results to the following in our browser console: ![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/ts7dDTLMTE6peI1Ld5xY_Screen%20Shot%202017-11-09%20at%203.22.05%20AM.png) This is a very common loader. We will further demonstrate some few loaders with popular frameworks including Angular(1.5+) and React.

### raw-loader

It is a loader that lets us import files as a string. We will show this by importing a HTML template to use for an angular component.

**Configuration**

```javascript
//webpack.config.js
...
module: {
      rules: [
         ...,
          {
              test: /\.html/,
              loader: 'raw-loader'
          }
      ]
  },
  ...
```

**Use**

```javascript
//src/app/index.js
import angular from 'angular';
import template from './index.tpl.html';

let component = {
    template // Use ES6 enhanced object literals.
}

let app = angular.module('app', [])
    .component('app', component)
```

We could alternatively use `template: require('./index.tpl.html'` instead of the import statement and have a simple HTML file.

```html
//src/app/index.tpl.html
<h3>Test raw-loader for angular component</h3>
```

### sass-loader

The `sass-loader` helps us to use `scss` styling in our application. It requires `node-sass` which allows us to natively compile `.scss` files to CSS at incredible speed and automatically via a connect middleware. It is recommended to use it together with `css-loader` to turn it into a JS module and `style-loader` that will add CSS to the DOM by injecting a `style` tag.

```sh
$ yarn add sass-loader node-sass css-loader style-loader -D
```

**Configuration**

```javascript
//webpack.config.js
...
module: {
      rules: [
         ...,
          {
            test: /\.(sass|scss)$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
          }
      ]
  },
  ...
```

```sass
//src/style/app.scss
$primary-color: #2e878a;
body {
    color: $primary-color;
}
```

**Use**

We simply import it in the template as follows and the styling will kick in.

```javascript
//src/app/app.js
...
import '../style/app.scss';
...
```

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/80QKq9RqRjOg7XBEP7e2_Screen%20Shot%202017-11-09%20at%204.06.56%20AM.png)

So far those are enough loaders to guide us in the right direction on how to add other loaders.

[Plugins](#toc-plugins)
-----------------------

Plugins are the backbone of webpack and serve the purpose of doing anything else that a loader cannot do.

Loaders do the pre-processing transformation of any file format when you use them; they work at the individual file level during or before the bundle is generated. On the other hand, plugins are quite simple since they expose only one single function to webpack and are not able to influence the actual build process.

Plugins work at bundle or chunk level and usually work at the end of the bundle generation process.

Plugins can also modify how the bundles themselves are created and have more powerful control than loaders. The figure below illustrates where loaders and plugins operate.

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/TBz67eq5RPyT9wZnxaNS_Screen%20Shot%202017-11-30%20at%204.55.00%20AM.png)

We have already used `html-webpack-plugin` and we will demonstrate how to use some more common plugins in our project.

### extract-text-webpack-plugin

Extracts text from a bundle, or bundles, into a separate file. This is very important in ensuring that when we build our application, the CSS is extracted from the Javascript files into a separate file. It moves all the required CSS modules in entry chunks into a separate CSS file. Our styles will no longer be inlined into the JS bundle, but in a separate CSS file (styles.css). If our total stylesheet volume is big, it will be faster because the CSS bundle is loaded in parallel to the JS bundle.

```sh
$ yarn add extract-text-webpack-plugin -D
```

**Configuration**

```javascript
//webpack.config.js
var ExtractTextPlugin = require('extract-text-webpack-plugin');
...
{
  test: /\.css$/,
  use: ExtractTextPlugin.extract({  
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader'},
      { loader: 'sass-loader'}
    ],
  })
},
plugins: [
    new ExtractTextPlugin("styles.css"), // extract css to a separate file called styles.css
  ]
...
```

### DefinePlugin

The DefinePlugin allows you to create global constants which can be configured at compile time. This can easily be used to manage import configurations like API keys and other constants that can be changed easily. The best way to use this plugin is to create a `.env` file with different constants and access them in our configuration using `dotenv` package then we can directly refer to these constants in our code.

```sh
$ yarn add dotenv -D
```

We can then create a simple environmental variable in our `.env` file.

```
//.env
API_KEY=1234567890
```

**Configuration**

```javascript
...
require('dotenv').config()
...
plugins: [
    new webpack.DefinePlugin({  // plugin to define global constants
          API_KEY: JSON.stringify(process.env.API_KEY)
      })
]
```

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/9XTSAJRHSquRaiKYdF2H_Screen%20Shot%202017-11-09%20at%204.50.12%20AM.png)

### webpack-dashboard

This is a rarely used CLI dashboard for your `webpack-dev-server`. The plugin introduces "beauty and order" in our development environment and instead of the normal console logs, we get to see an attractive easy to interpret dashboard.

**Installation**

```sh
$ yarn add webpack-dashboard -D
```

**Configuration**

```javascript
//webpack.config.js
...
const DashboardPlugin = require('webpack-dashboard/plugin');
...
plugins: [
      new DashboardPlugin()
  ],
...
```

We then edit our start script to use the plugin.

```json
//package.json
...
"scripts": {
    "start": "webpack-dashboard -- webpack-dev-server --history-api-fallback --inline --progress"
  }
...
```

After running our application, we see a very nice interface. ![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/YPlHGdyRMW0i3K0tWbAF_Screen%20Shot%202017-11-10%20at%203.10.17%20AM.png)

[Development Environments](#toc-development-environments)
---------------------------------------------------------

In this last section, we focus on how we can use webpack to manage different environment configurations. This will also include use of some plugins depending on the environment which can either be testing, development, staging or production depending on the provided environmental variables. We will rely on `dotenv` package to get our environment. Some of the things that can vary between these environments include `devtool` and plugins like `extract-text-webpack-plugin`, `UglifyJsPlugin` and `copy-webpack-plugin` among others.

*   `devtool`\- Controls if and how source maps are generated.
*   `copy-webpack-plugin` - Copies individual files or entire directories to the build directory. This is recommended for production to copy all assets to the output folder.
*   `uglifyjs-webpack-plugin` - Used to minify our Javascript bundle. Recommended to be used in production to reduce the size of our final build.

**Installation**

```sh
$ yarn add copy-webpack-plugin uglifyjs-webpack-plugin -D
```

**Configuration**

We will alter our configuration a bit to accomodate this functionality. We also remove `DashboardPlugin` which is known to cause some issues when minifying.

```javascript
//webpack.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
require('dotenv').config()

const ENV = process.env.APP_ENV;
const isTest = ENV === 'test'
const isProd = ENV === 'prod';

function setDevTool() {  // function to set dev-tool depending on environment
    if (isTest) {
      return 'inline-source-map';
    } else if (isProd) {
      return 'source-map';
    } else {
      return 'eval-source-map';
    }
}
...
const config = {
...
devtool: setDevTool(),  //Set the devtool
...
}

// Minify and copy assets in production
if(isProd) {  // plugins to use in a production environment
    config.plugins.push(
        new UglifyJSPlugin(),  // minify the chunk
        new CopyWebpackPlugin([{  // copy assets to public folder
          from: __dirname + '/src/public'
        }])
    );
};

module.exports = config;
```

The difference between the bundle sizes before and after minification are clearly visible. We have managed to trim our code from `1.57MB` to `327kB`.

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/P31kY6NeQuOoTeyhwwG8_Screen%20Shot%202017-11-10%20at%204.29.51%20AM.png)

![](https://scotch-res.cloudinary.com/image/upload/dpr_1,w_800,q_auto:good,f_auto/media/5000/RzYuVjGzRoadoNle5pRQ_Screen%20Shot%202017-11-10%20at%204.30.07%20AM.png)

[Conclusion](#toc-conclusion)
-----------------------------

`webpack` is definitely a poweful tool for development and is easy to configure once you grasp the few concepts that are applied. Managing multiple configurations for multiple environments can be very cumbersome but `webpack-merge` provides us with the ability to merge different configurations and avoid use of `if` statements for configurations. This article demonstrates just a few of the many different loaders and plugins that make using webpack fun. Feel free to play around with different plugins and frameworks to better understand the power of webpack.