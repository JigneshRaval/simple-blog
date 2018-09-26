---
path: "Vue.js/vue.js-and-webpack-4-from-scratch,-part-1"
date: "2018-09-25"
title: "Vue.js and Webpack 4 From Scratch, Part 1"
tags: ["Vue.js","Webpack 4"]
category: "Vue.js"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://itnext.io/vuejs-and-webpack-4-from-scratch-part-1-94c9c28a534a"
type: "Post"
---

### Part 1: Up and running

My previous [article](http://medium.com/@petrefax66/getting-started-vue-js-and-visual-studio-code-6990f92e918a) described how to create a Vue.js application using the command line interface. This is the easiest way to get started and will be suitable for the majority of needs. However, it certainly doesn’t hurt to try taking the opposite road and build an application entirely from scratch. With the release of [Webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4) now is a good time to take this ambitious route and learn a bit more about the workings of the build and bundling process by crafting it entirely by hand.

In this article I will start with an empty folder and create a webpack build for a Vue.js application including:

*   Hot Module loading with webpack-dev-server
*   Linting using eslint
*   CSS pre-processing with stylus
*   Testing using @vue/test-utils and Jest

The only pre-requisite is having node and npm installed, although I will be using VSCode as my editor.

The final code for this article is available on [github](https://github.com/dfcook/vue-webpack4-template) for reference, the official webpack templates will undoubtedly be updated to Webpack 4 shortly.

As this is quite a long process I will divide the article into parts, this first part will take us from an empty folder up to a simple page containing a Vue component bundled with webpack and opened in a browser window.

[Part 2](https://medium.com/@petrefax66/vue-js-and-webpack-4-from-scratch-part-2-5038cc9deffb) will cover hot module reloading, styling and transpilation using babel.

The [final part](https://medium.com/@petrefax66/vue-js-and-webpack-4-from-scratch-part-3-3f68d2a3c127) covers linting, testing, static assets and CSS extraction.

* * *

The first thing to do is create a new folder, cd into it and initialise NPM:

`npm init`

You will be asked to provide some information about the project, it’s safe to accept defaults at this stage, and once completed you will have a package.json file entirely empty of anything other than meta-information. Now we can begin adding our packages.

`npm install --save vue vue-router`

This installs our application dependencies.

`npm install --save-dev webpack webpack-cli`

This installs webpack to allow us to begin building our application bundle.

#### Application Structure

I like to put all the application code, our javascript and vue components, in a subfolder called src. In here I will add:

1.  app.js : The application entrypoint.
2.  App.vue: The root component
3.  pages: A folder containing all top-level components, each of these will have a route entry associated with it.
4.  components: A folder containing our building block components. Components will be organised into sub-folders based on feature.
5.  router: A folder for all our vue-router configuration.

If I was using vuex I would create another folder called store to contain all our actions/mutations etc.

When I create these, the folder structure should look like this:

![](https://cdn-images-1.medium.com/freeze/max/30/1*jRQYrW3t2qkOZYezwuPz5A.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*jRQYrW3t2qkOZYezwuPz5A.png)

![](https://cdn-images-1.medium.com/max/800/1*jRQYrW3t2qkOZYezwuPz5A.png)

We’ll start our app.js with possibly the simplest entrypoint possible:

import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

This will pull in our App component and render it into the DOM element with id “app”. Our App component is just as simple for the moment:

<template>
  <div>
    <h1>Hello World!</h1>
  </div>
</template>

Now we have some Vue code, we need to bundle it using Webpack so it can be pulled into our html.

* * *

#### Webpack

Webpack is a module bundler for Javascript applications, when we run the webpack command we are asking it to start at our entrypoint and then build a dependency graph of the whole application, pulling those dependencies into one or more bundles that can be included in our application. It supports multiple different file types through **loaders**, loaders will take files that have no concept of modules (e.g. css) and process them in a way that allows them to participate in the overall dependency graph that webpack is building.

Webpack 4 was just released with a ton of new features including:

1.  Built-in chunking support with the optimization API.
2.  Support for 5 different module types, including Web Assembly modules.
3.  A “mode” configuration setting that applies a sensible set of defaults, simple projects can be built relying on this alone to determine how to build your application.
4.  Zero-config setups (#0CJS). If you supply the mode then Webpack will use default entry and output settings to build your application without the need for a config file.

All this plus smaller bundle sizes and faster build times!

Let’s try out a simple webpack build.

In the root of our project create a folder called build and add a file called webpack.config.dev.js. We will use this to configure a loader for our Vue single-file components.

'use strict'

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: \[
    './src/app.js'
  \],
  module: {
    rules: \[
      {
        test: /\\.vue$/,
        use: 'vue-loader'
      }
    \]
  },
  plugins: \[
    new VueLoaderPlugin()
  \]
}

The module section will contain all our loaders, each loader declaration consists of a minimum of 2 properties, test and loader. Test is a regular expression that webpack will use to identify which file types to be processed by this loader and loader is the name of the loader itself.

For this to work we need to install some more dependencies:

npm install --save-dev vue-loader vue-template-compiler vue-style-loader css-loader

And add an npm build script:

"build": "webpack --config build/webpack.config.dev.js"

We also need to add an index.html file to pull in our built bundle, place this in the root of the project:

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>My Vue app with webpack 4</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="dist/main.js" type="text/javascript"></script>
  </body>
</html>

If you now run the build script you should see something like this:

![](https://cdn-images-1.medium.com/freeze/max/30/1*pxfPPRzyQhKNopB4D_2kSA.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*pxfPPRzyQhKNopB4D_2kSA.png)

![](https://cdn-images-1.medium.com/max/800/1*pxfPPRzyQhKNopB4D_2kSA.png)

And if you open index.html in your browser you should see:

![](https://cdn-images-1.medium.com/freeze/max/30/1*zFpgviKqRMZdzf5fhsGobg.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*zFpgviKqRMZdzf5fhsGobg.png)

![](https://cdn-images-1.medium.com/max/800/1*zFpgviKqRMZdzf5fhsGobg.png)

As an aside, there is an extension for VSCode, “Live Server”, that allows you to right-click on html files and launch them in an on-demand web server as opposed to opening them from your file system. Eventually we will serve our application using webpack-dev-server with hot module reloading but for the meantime this is an excellent stopgap.

#### Next Step

In the next part of the article I will create a component with some script to illustrate babel-compilation and configure stylus for our css. We will install webpack-dev-server and configure hot module reloading including support for static assets. To complete the application we will create a production build including splitting out of vendor modules and show how to test our application using @vue/test-utils and jest.
