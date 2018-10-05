---
path: "React/webpack-typescript-react-part-2"
date: "2018-10-04"
title: "webpack + TypeScript + React: Part 2"
tags: ["React","Webpack","Typescript"]
category: "React"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://codeburst.io/webpack-typescript-react-part-2-366c102a760b"
type: "Post"
---

webpack + TypeScript + React: Part 2
====================================

Having built our “hello world” _TypeScript_ web application, we introduce third-party libraries (in particular _React_).

![](https://cdn-images-1.medium.com/freeze/max/30/1*KtC8Txt4_xtBxCMavLz68w.jpeg?q=20)

![](https://cdn-images-1.medium.com/max/800/1*KtC8Txt4_xtBxCMavLz68w.jpeg)

![](https://cdn-images-1.medium.com/max/800/1*KtC8Txt4_xtBxCMavLz68w.jpeg)

This article is part of a series starting with [_webpack + TypeScript + React: Part 1_](https://codeburst.io/webpack-typescript-react-part-1-dc154e250f23). All of the examples are also available for [download](https://github.com/larkintuckerllc/webpack-typescript-patterns).

**Source Map**

As we likely want to be able to use the browser’s development tools to debug our _TypeScript_, we can include a source map. Starting from the previous example we update:

_source-map/tsconfig.json_

{  
    "compilerOptions": {  
        "noImplicitAny": true,  
 **"sourceMap": true,**  
        "target": "es5"  
    }  
}

_source-map/webpack.config.js_

...    
**devtool: 'source-map',**   
module: {  
    rules: \[  
...

Now running the following will generate a _main.bundle.js.map_ in the dist folder:

./node\_modules/.bin/webpack

**React**

Let us now refactor our previous example into a _React_ application.

npm install react  
npm install react-dom  
npm install @types/react  
npm install @types/react-dom

Observations:

*   First, you can shorten the previous command into a single line as _npm_ can accept multiple package names; broke apart in this article for clarity
*   Installing versioned third-party declaration files is preferable compared to the current state of affairs with _Flow;_ where you have to check-in the [third-party library definitions](https://github.com/flowtype/flow-typed/blob/master/README.md) into your repository.
*   Not exactly sure why, but the _react-dom_ declaration package depended on the _node_ one (no big deal, but odd).

Next we need to update:

_react/tsconfig.json_

{  
    "compilerOptions": {  
 **"jsx": "react",**  
        "noImplicitAny": true,  
        "sourceMap": true,  
        "target": "es5"  
    }  
}

Next we update:

_webpack.config.js_

const path = require('path');

module.exports = {  
 **entry: './src/index.tsx',**  
    output: {  
        filename: '\[name\].bundle.js',  
        path: path.resolve(\_\_dirname, 'dist'),  
    },  
    devtool: 'source-map',  
 **resolve: {  
        extensions: \['.js', '.json', '.ts', '.tsx'\],  
    },**  
    module: {  
        rules: \[  
            {  
 **test: /\\.(ts|tsx)$/,**                loader: 'awesome-typescript-loader',  
            },  
        \],  
    },  
};

Observations:

*   The official _TypeScript_ [_React & webpack_](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) tutorial includes [_source-map-loader_](https://www.npmjs.com/package/source-map-loader); did not use in this example as it was not clear that it was necessary (confirmed that the source maps were properly generated with this configuration).
*   Their tutorial also uses the _webpack_ [_externals_](https://webpack.js.org/configuration/externals/) option using the argument of keeping the vendor code out of the main bundle for download and caching performance reasons. Given a proper bundle splitting _webpack_ configuration is is a non issue (this simple example, however, outputs a monolithic bundle).

We add a _root_ div to:

_react/public/index.html_

<!doctype html>  
<html lang="en">  
  <head>  
    <meta charset="utf-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1">  
    <title>webpack TypeScript Patterns</title>  
  </head>  
  <body>  
 **<div id="root"></div>** <script src="main.bundle.js"></script>  
  </body>  
</html>

We replace the _index.ts_ file with an _index.tsx_ and include _App.tsx:_

_react/src/index.tsx_

import \* as React from 'react';  
import { render } from 'react-dom';  
import App from './components/App';

render(  
    <App message="World" />,  
    document.getElementById('root'),  
);

_react/src/components/App.tsx_

import \* as React from 'react';

interface AppProps {  
    message: string,  
};  
export default function({ message }: AppProps ) {  
    return <h1>Hello {message}</h1>;  
};

**note**: Apparently the use of _import \* as React from ‘react’;_ instead of the more common _import React from ‘react’;_ is due to a difference in opinion between _TypeScript_ and _Babel_ on handling _CommonJS_ modules.

As I am using an editor that supports _TypeScript_ out of the box (the no-cost [_Visual Studio Code_](https://code.visualstudio.com/)), I get some immediate benefits from using _TypeScript_. As we have included the type declarations for the third-party libraries, we get code completion.

![](https://cdn-images-1.medium.com/freeze/max/30/1*TT52Y-3mm_91fyZMLEbsgg.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*TT52Y-3mm_91fyZMLEbsgg.png)

![](https://cdn-images-1.medium.com/max/800/1*TT52Y-3mm_91fyZMLEbsgg.png)

Another interesting pattern with _TypeScript_ is to **not** use the _React_ component’s _propTypes_ property to enforce proper component usage (at run-time). Instead, we use _TypeScript_ for this purpose (the _interface AppProps_). The big benefit of this is that we get these as compile-time errors. Say we forget to provide the _message_ property for the _App_ component:

![](https://cdn-images-1.medium.com/freeze/max/30/1*t2VDddx7HSL2N98_fe8KBQ.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*t2VDddx7HSL2N98_fe8KBQ.png)

![](https://cdn-images-1.medium.com/max/800/1*t2VDddx7HSL2N98_fe8KBQ.png)

**note**: With _Visual Studio Code_ we also see this same error while editing the file.

To build and run we, as before, copy of the _index.html_ file an run _webpack_.

cp public/index.html dist  
./node\_modules/.bin/webpack

We can then open _index.html_ in a browser to see the resulting web application.

**Next Steps**

In the next article, [_webpack + TypeScript + React: Part 3_](https://medium.com/@johntucker_48673/webpack-typescript-react-part-3-82ce3000d25e), we explore our linting options.