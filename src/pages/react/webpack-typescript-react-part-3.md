---
path: "React/webpack-typescript-react-part-3"
date: "2018-10-04"
title: "webpack + TypeScript + React: Part 3"
tags: ["React","Webpack","Typescript"]
category: "React"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://codeburst.io/webpack-typescript-react-part-3-82ce3000d25e"
type: "Post"
---

webpack + TypeScript + React: Part 3
====================================

We continue to explore this development environment; including linting.

![](https://cdn-images-1.medium.com/freeze/max/30/1*KtC8Txt4_xtBxCMavLz68w.jpeg?q=20)

![](https://cdn-images-1.medium.com/max/800/1*KtC8Txt4_xtBxCMavLz68w.jpeg)

![](https://cdn-images-1.medium.com/max/800/1*KtC8Txt4_xtBxCMavLz68w.jpeg)

This article is part of a series starting with [_webpack + TypeScript + React: Part 1_](https://codeburst.io/webpack-typescript-react-part-1-dc154e250f23). All of the examples are also available for [download](https://github.com/larkintuckerllc/webpack-typescript-patterns).

**Fix**

In the previous _React_ example, we had a fairly simple _TypeScript_ compiler configuration. At the same time, we had some oddities, e.g., the way we had to import _React_. Happened to learn about a _create-react-app_ [option](https://www.npmjs.com/package/react-scripts-ts) that provides a sample _tsconfig.json_ configuration that addresses several issues.

Starting from our previous _React_ example, we update:

_fix/tsconfig.json_

{  
    "compilerOptions": {  
 **"allowSyntheticDefaultImports": true,**  
        "jsx": "react",  
 **"module": "ESNext",  
        "moduleResolution": "node",**  
        "noImplicitAny": true,  
        "sourceMap": true,  
        "target": "es5"  
    },  
 **"exclude": \[  
        "node\_modules"  
    \],**     
}

Observations:

*   The _module_ and _moduleResolution_ properties configure _TypeScript_ to treat modules as _ESNext_ modules (really same as _ES2015_ as far as I can tell) and to use _node\_modules_ for third-party packages.
*   The _allowSyntheticDefaultImports_ property appears to enable _TypeScript_ to treat _CommonJS_ modules as _ESNext_ modules; allowing use to just use _import React from ‘react’_.
*   Finally, we exclude _node\_modules_ as we do not want to transpile third-party modules.

Also, there are some issues with viewing web pages from the file-system; so we can simply run the following from the _dist_ folder (downloads, caches, and runs a lightweight HTTP server).

npx http-server

**Ant**

Next we will explore a third-party library that inherently supports _TypesScript_; does not require a separate type declarations; [_Ant Design_](https://ant.design/).

First we need to support importing CSS files in our _webpack_ build:

npm install css-loader --save-dev  
npm install style-loader --save-dev

_ant/webpack.config.js_

...  
module: {  
    rules: \[  
        {  
            test: /\\.(ts|tsx)$/,  
            loader: 'awesome-typescript-loader',  
        },         
 **{  
            test: /\\.css$/,  
            use: \[  
                {  
                    loader: 'style-loader',  
                },  
                {  
                    loader: 'css-loader',  
                },  
            \],  
        },**  
    \],  
...

We then install _Ant Design_ and use it.

  
npm install antd

_ant/src/components/App.tsx_

import React from 'react';  
**import Button from 'antd/lib/button';  
import 'antd/lib/button/style/css';**

interface AppProps {  
    message: string,  
};  
export default function({ message }: AppProps ) {  
    return (  
        <div>  
            <h1>Hello {message}</h1>  
 **<Button type="primary">Test</Button>**  
         </div>  
    );  
};

Just so happens that _Ant Design_ is written in _TypeScript_ and as such we benefit with some compile time checking; for example, we can immediately see that the _Button_ component does not support the _bogus_ property (either in the editor or when compiling).

![](https://cdn-images-1.medium.com/freeze/max/30/1*vFdH5fkZzdPsL7i2GgXIhA.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*vFdH5fkZzdPsL7i2GgXIhA.png)

**note**: I was really expecting to find that we additionally would have JSX autocomplete features in _Visual Studio Code;_ I could not find a definitive answer on this.

**note**: _Ant Design_, with some additional changes to _webpack_, supports both a more streamlined import and theme customization; applying the feature as described in the series starting with [_Ant Design by Example: Part 1_](https://codeburst.io/ant-design-by-example-part-1-f915e4a5547), we end up with this [example](https://github.com/larkintuckerllc/webpack-typescript-patterns/tree/master/ant-themed).

**Linting**

Having become accustomed to strong opinionated linting with [_ESLint_](https://eslint.org/) and [_eslint-config-airbnb_](https://www.npmjs.com/package/eslint-config-airbnb)_,_ I was happy to learn that there is [_TSLint_](https://palantir.github.io/tslint/) and [_tslint-config-airbnb_](https://www.npmjs.com/package/tslint-config-airbnb).

**note**: From what I can tell, much (if not all) of the compiler linting options are a duplication of what is available with _TSLint_ and _tslint-config-airbnb_.

Starting from our previous example we install and initialize _TSLint_.

npm install tslint --save-dev  
./node\_modules/.bin/tslint --init  
  

Running _TSLint_ with the default rules:

./node\_modules/.bin/tslint -c tslint.json 'src/\*\*/\*.tsx'

generates quite a few errors:

ERROR: src/components/App.tsx\[1, 19\]: ' should be "  
ERROR: src/components/App.tsx\[2, 1\]: Import sources within a group must be alphabetized.  
ERROR: src/components/App.tsx\[2, 20\]: ' should be "  
ERROR: src/components/App.tsx\[3, 8\]: ' should be "  
ERROR: src/components/App.tsx\[5, 11\]: interface name must start with a capitalized I  
ERROR: src/components/App.tsx\[6, 20\]: Properties should be separated by semicolons  
ERROR: src/components/App.tsx\[7, 2\]: Unnecessary semicolon  
ERROR: src/components/App.tsx\[16, 1\]: Missing semicolon  
ERROR: src/index.tsx\[1, 19\]: ' should be "  
ERROR: src/index.tsx\[2, 24\]: ' should be "  
ERROR: src/index.tsx\[3, 17\]: ' should be "  
ERROR: src/index.tsx\[7, 29\]: ' should be "

Let us next install the _AirBnb_ rules:

npm install tslint-config-airbnb --save-dev

and update:

_linting/tslint.json_

{  
  "extends": "tslint-config-airbnb"  
}

Running _TSLint_ with these rules generates a lot (but different errors).

Warning: The 'no-boolean-literal-compare' rule requires type information.  
Warning: The 'strict-boolean-expressions' rule requires type information.

ERROR: src/components/App.tsx\[1, 1\]: Misnamed import. Import should be named 'react' but found 'React'  
ERROR: src/components/App.tsx\[2, 1\]: Misnamed import. Import should be named 'button' but found 'Button'  
ERROR: src/components/App.tsx\[6, 1\]: Expected indentation of 2 spaces but found 4.  
ERROR: src/components/App.tsx\[6, 20\]: Properties should be separated by semicolons  
ERROR: src/components/App.tsx\[7, 2\]: Unnecessary semicolon  
ERROR: src/components/App.tsx\[8, 24\]: Missing whitespace before function parens  
ERROR: src/components/App.tsx\[8, 47\]: there should be no spaces inside this paren.  
ERROR: src/components/App.tsx\[9, 1\]: Expected indentation of 2 spaces but found 4.  
ERROR: src/components/App.tsx\[15, 2\]: Unnecessary semicolon  
ERROR: src/index.tsx\[1, 1\]: Misnamed import. Import should be named 'react' but found 'React'

**note**: We also can [enable](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) _TSLint_ in _Visual Studio Code;_ allows to lint as we edit.

Observations:

*   The rules complain about not matching import names to import file, e.g., _import React from ‘react’;_ But because JSX implicitly needs React, we can disable this warning with _/\* tslint:disable-next-line \*/_
*   We have the same problem, _Button_ vs. _button_, with imports from the _Ant Design_ library; seems that disabling the warning is the lesser of two evils (want components to be capitalized)
*   Also, went ahead and changed the automatic indentation to be two spaces in the source (as well as set as the default in my editor).

**Next Steps**

In the next article,  [_webpack + TypeScript + React: Part 4_](https://medium.com/@johntucker_48673/webpack-typescript-react-part-4-14582e9a33ce), we will explore testing in this environment.