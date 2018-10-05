---
path: "React/webpack-typescript-react-part-1"
date: "2018-10-04"
title: "webpack + TypeScript + React: Part 1"
tags: ["React","Webpack","Typescript"]
category: "React"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://codeburst.io/webpack-typescript-react-part-1-dc154e250f23"
type: "Post"
---

webpack + TypeScript + React: Part 1
====================================

Exploring moving from _ES2015_ to _TypeScript_ for frontend development with _webpack_ and _React_.

![](https://cdn-images-1.medium.com/freeze/max/30/1*r5m7BmHh7EvJL2TfO-bUKQ.jpeg?q=20)

![](https://cdn-images-1.medium.com/max/800/1*r5m7BmHh7EvJL2TfO-bUKQ.jpeg)

![](https://cdn-images-1.medium.com/max/800/1*r5m7BmHh7EvJL2TfO-bUKQ.jpeg)

I have been avoiding writing this article for some time; having invested heavily in _JavaScript_ _ES2015_ and the tooling around it, I assumed that that a move to [_TypeScript_](https://www.typescriptlang.org/) would be painful. The good news is that, so far, my fears have been unfounded.

My recent interest in _TypeScript_ stems my general interest in being more rigorous in my development and from some recent challenges I ran into when trying to adopt the _JavaScript_ static type checker [_Flow_](https://flow.org/). The biggest challenge being, finding quality (and documented) type definitions for third-party libraries.

While I have an interest in exploring _TypeScript_ for both backend and frontend development, I am going to focus this series on the frontend (and with [_React_](https://reactjs.org/) in particular). The important news is that the _TypeScript_ is compatible (they provide tutorials on it) with both [_webpack_](https://webpack.js.org/)  and _React_.

This series not a tutorial on _webpack_, _TypeScript,_ or _React_, but rather documenting my effort in creating (or more precisely re-creating) a frontend development environment using them.

**note**: I have, separately, written extensively on _webpack_ + _ES2015_ + _React_ starting with the article [_webpack By Example: Part 1_](https://medium.com/front-end-hacking/webpack-by-example-part-1-1d07bc42006a)_._

If you wish to follow along, you will need to install a recent version of [_Node.js_](https://nodejs.org/en/) (I used version _8.9.4 LTS_). All of the examples are also available for [download](https://github.com/larkintuckerllc/webpack-typescript-patterns).

**hello**

Starting from an empty folder, we initialize the project and install the required development dependencies.

npm init  
npm install --save-dev webpack  
npm install --save-dev webpack-cli  
npm install --save-dev typescript  
npm install --save-dev awesome-typescript-loader

note: Added _webpack-cli_ based on new version of _webpack (v4.x.x)_.

Observations:

*   Compared to an _ES2015_ project, we use the _typescript_ package instead of _babel-core_ and _babel-preset-es2015_ packages
*   Similarly, we use the _awesome-typescript-loader_ instead of _babel-loader_

Instead of a _.babelrc_ file in _ES2015_ projects, we use a _tsconfig.json_ to override the default _TypeScript_ [compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

_hello/tsconfig.json_

"compilerOptions": {  
        "noImplicitAny": true,  
        "target": "es5"  
    }  
}

Observations:

*   We require the compiler to report errors on implied _any_ types (a little fuzzy about what this means; but it was in their tutorial)
*   We output _ES5 JavaScript_ (compiler defaults to _ES3_).

We configure _webpack_ with a minimal configuration:

_hello/webpack.config.js_

const path = require('path');

module.exports = {  
    entry: "./src/index.ts",  
    output: {  
        filename: "\[name\].bundle.js",  
        path: path.resolve(\_\_dirname, 'dist'),  
    },  
    module: {  
        rules: \[  
            {  
                test: /\\.ts$/,  
                loader: "awesome-typescript-loader"  
            },  
        \]  
    },  
};

We create the HTML file to use:

_hello/public/index.html_

<!doctype html>  
<html lang="en">  
  <head>  
    <meta charset="utf-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1">  
    <title>webpack TypeScript Patterns</title>  
  </head>  
  <body>  
  <script src="main.bundle.js"></script>  
  </body>  
</html>

We then create the _TypeScript_ file based on the tutorial [_TypeScript in 5 Minutes_](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

_hello/src/index.ts_

class Student {  
    fullName: string;  
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {  
        this.fullName = \`${firstName} ${middleInitial} ${lastName}\`;  
    }  
}  
interface Person {  
    firstName: string;  
    lastName: string;  
}  
function greeter(person : Person) {  
    return \`Hello, ${person.firstName} ${person.lastName}\`;  
}  
const user = new Student('Jane', 'M.', 'User');  
document.body.innerHTML = greeter(user);

Observations:

*   Fixed the tutorial’s example by using _const_ instead of _let_ (never reassigning the _user_ variable).
*   Changed to using single quotes instead of double quotes for string literals (typically associate double quotes with _JSX_).
*   Used _ES6_ template strings (_TypeScript_ extends _ES6_).

We then build the project with:

./node\_modules/.bin/webpack

and manually (for now) copy over the _index.html_ file:

cp public/index.html dist

We can test the project by opening the file _hello/dist/index.html_ in a browser.

![](https://cdn-images-1.medium.com/freeze/max/30/1*mBPzzaEPitCQu9A_KcqVOg.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*mBPzzaEPitCQu9A_KcqVOg.png)

![](https://cdn-images-1.medium.com/max/800/1*mBPzzaEPitCQu9A_KcqVOg.png)

**Next Steps**

The next step is to explore adding in third-party libraries, like _React_, in [_webpack + TypeScript + React: Part 2_](https://medium.com/@johntucker_48673/webpack-typescript-react-part-2-366c102a760b).