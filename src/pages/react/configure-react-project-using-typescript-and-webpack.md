---
path: "React/configure-react-project-using-typescript-and-webpack"
date: "2018-10-04"
title: "Configure React project using TypeScript and Webpack"
tags: ["React","Webpack","Typescript"]
category: "React"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://medium.com/@justin.pathrose/configure-react-project-using-typescript-and-webpack-f69faee3e915"
type: "Post"
---

Hope your search ends here if you are trying to configure a [_React_](https://facebook.github.io/react/) project using Typescript and [_webpack_](https://webpack.js.org/). We will not be discussing react as such, but at the end of this you will be able to start your own react app in typescript using webpack.

As this is mainly aimed at developers relatively new to the “new” way of web development, we will go through each step in quite detail.

**Prerequisites**

Node installed.

Node is a javascript runtime built on Chrome’s V8 JavaScript engine. To learn more go [_here_](https://nodejs.org/en/). This helps us to run javascript outside of browser ecosystem. We can also take advantage of never ending list of open source libraries using the package manager npm. However we will use Yarn instead of node. If you have not installed [_Yarn_](https://yarnpkg.com/en/), install Yarn globally using npm. Yarn is fast, reliable and secure alternative to npm. Its ability to work in an offline mode and consistently across systems is definitely a boon over npm.

_$ npm install -g yarn_

**Creating the project**

$ yarn init

This will take you through an interactive session at the end of which you will have the [**_package.json_**](https://docs.npmjs.com/files/package.json) file created. This is where the meta data of your project is captured, including dependencies and other life cycle events during the different phases of the project. More on this later.

**Installing development dependencies.**

We will now install webpack and TypeScript as development dependencies.

$ yarn add webpack --dev  
$ yarn add typescript --dev

This is because we will be using TypeScript and webpack only during development phase. Once development is over, we will be using the bundled code(for bundling we will use webpack), with TypeScript transpiled to es5, which is supported across browsers.

**what is webpack and why we use it**

When using typescript, you take advantage of the advanced features of es2015 and typescript specific features. But the browsers are not yet matured enough to understand these new constructs. This is where webpack comes to picture.

So how does webpack help in solving the above problem? Its worth knowing! In a nut shell, [webpack](https://webpack.js.org/) is a module bundler for javascript applications. Don’t scratch your head yet! We will understand in more detail. As I said earlier, we use typescirpt in this project and bowser doesn’t understand it. So we need a tool that will convert(we call it transpile) it to es5 which the browsers are comfortable with. Something strikes here? Yes this is done with the help of webpack. When webpack tries to build a project, we need to tell how to build giving a set of configurations. This is given using webpack.config.js file. When it compiles typescript files, it works in tandem with the tsconfig.json file which we will discuss later.

**Create webpack.config.js**

Below given is the webpack configuration we are using in this project. The various configuration options used are explained inline.

var path = require("path");

var config = {  
_/\* The entry point of the application. Webpack uses this information to create the dependency tree which is used to bundle the scripts.\*/_  
entry: \["./app/App.tsx"\],

_/\* This information is used to give the name of the bundled file and the location of the bundled file. \*/_  
output: {  
   path: path.resolve(\_\_dirname, "build"),  
   publicPath: "/build/",  
   filename: "bundle.js"  
},

_/\* The extensions which will be imported or required in the application scripts. \*/_  
resolve: {  
    extensions: \[".ts", ".tsx", ".js"\]  
},

module: {

_/\* Define the loaders to be used. Regex will test the type of files on which the loader is to be applied. The excluded files are also mentioned. Loaders are used mainly to preprocess/transpile the file when imported or required in the scripts before bundling. \*/_

loaders: \[{  
    test: /\\.tsx?$/,  
    loader: "ts-loader",  
    exclude: /node\_modules/  
  }\]  
}};

module.exports = config;

Installing ts-loader

$ yarn add ts-loader --dev

**Integrating react**

We will install react and react-dom as dependencies.

$ yarn add react --save  
$ yarn add react-dom --save

**Installing type definitions**

To fully utilise the power of typescript, we need to install typescript definition files for react and react-dom. Typescript definition files provides type information for javascript code which by itself is not statically typed. This also helps us in getting the method signatures when using them and catching errors during compile time itself. These are files with extension .d.ts. Here we are installing type definitions for react and react-dom.

$ yarn add @types/react-dom --dev  
$ yarn add @types/react --dev

**_typescript config_**

As we had a configuration for webpack, we need to have a config — [_tsconfig.json_](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for using typescript with react.

{  
 "compilerOptions": {  
  "jsx": "react",  
  "module": "commonjs",  
  "noImplicitAny": true,  
  "outDir": "./build/",  
  "preserveConstEnums": true,  
  "removeComments": true,  
  "target": "ES5"  
 },  
 "exclude": \[  
  "node\_modules"  
 \]  
}

Most of them are self explanatory. Please note to have this file at the root of the project. For example in the complierOptions in the config, we have jsx option which tells that jsx syntax is expected in the tsx file, the module pattern is commonjs, the target version of compilation is es5 etc. You can read more [_here_](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

**Running the project**

Now that the basic setup is ready, we need ways to take build of the project and server the files on a server. For the build option we have already installed webpack. For serving the project we can use the [_webpack-dev-server_](https://www.npmjs.com/package/webpack-dev-server), which can be installed as below.

$ yarn add webpack-dev-server --dev

In the package.json below, note that we have defined start and build under the scripts option. Scripts is used to define what happens during various life cycle events. Once we start webpack-dev-server(using start key in scripts option in package.json), it starts serving your files. It also emits information about the compilation state to the client, which reacts to those events. You can choose between different modes, depending on your needs.

In the configuration specified in our webpack config, webpack-dev-server will serve the static files in your `build` folder. It’ll watch for changes in your source files, and recompile the bundle whenever they are changed.

When recompilation happens, the modified bundle is served from memory at the relative path specified in _publicPath(see webpack config)_. The build will not be written to your configured output path. Where a bundle already exists at the same URL path, the bundle in memory takes precedence.

See the package.json file below:

{  
 "name": "react-typescript",  
 "version": "1.0.0",  
 "description": "This is a react boilerplate project using   TypeScript and webpack",  
 "main": "App.tsx",  
 "repository": "https://github.com/justinpathrose/react-typescript.git",  
 "author": "justinpathrose",  
 "license": "MIT",  
 "scripts": {  
  "start": "./node\_modules/.bin/webpack-dev-server --progress",  
  "build": "webpack"  
 },  
 "devDependencies": {  
  "@types/react": "^15.0.24",  
  "@types/react-dom": "^15.5.0",  
  "ts-loader": "^2.0.3",  
  "typescript": "^2.2.2",  
  "webpack": "^2.3.2",  
  "webpack-dev-server": "^2.4.2"  
 },  
 "dependencies": {  
  "react": "^15.4.2",  
  "react-dom": "^15.4.2"  
 }  
}

Now you are ready to start working in your react application. To run your application, use the following from the terminal

$ yarn start

This will compile your project and serve it in memory at url path mentioned in publicPath config as discussed before. The app will be running on [http://localhost:8080](http://localhost:8080). Note that whenever you make changes to any files in your project, it is recompiled and the page in the bowser refreshes. That’s really nice right!

To take the build of the project, run the following from terminal

$ yarn run build

This will create a folder in your workspace as specified in the output config of webpack.

A project with the above mentioned setup is put up in GitHub. Please go ahead and clone — [https://github.com/justinpathrose/react-typescript.git](https://github.com/justinpathrose/react-typescript.git).

Once the project is cloned, run the following to get going!

$ yarn install  
$ yarn start

**Migrating to webpack 2**

There has been few changes in webpack 2. _loaders_ in webpack config is now deprecated and we use _rules_ now.

**_Source maps_**

I have also added the option to enable source maps so that debugging is seamless. There are 2 changes done for this, one in tsconfig and other in webpack config. We have enabled source map in tsconfig compiler options. This will generate source maps. To take that to the browser, we need webpack. This is done by yet another loader — source-map-loader. So this has to be updated in webpack config. This loader must also be installed as a dev dependency.

The changes are present in github repo — [https://github.com/justinpathrose/react-typescript.git](https://github.com/justinpathrose/react-typescript.git).

You can also refer another npm package —[_react-ts_](https://www.npmjs.com/package/react-ts)_._ This has a comprehensive set up including support for testing using mocha chai framework.

_happy coding!_