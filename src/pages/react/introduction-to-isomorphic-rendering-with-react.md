---
path: "React/introduction-to-isomorphic-rendering-with-react"
date: "2018-09-25"
title: "Introduction to Isomorphic Rendering with React"
tags: ["React","isomorphic"]
category: "React"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://cbateman.com/blog/introduction-to-isomorphic-rendering-with-react/"
type: "Post"
---

First off: yeah, isomorphic is a silly word, but there isn’t really a better alternative. If you’re not familiar, it just means the ability to render an app on both the client and the server.

Why would you want to render a JavaScript app on the server? Mainly, for performance. Not everyone (especially mobile users) is on the instant connection you use while you’re developing, and they end up staring at a blank page while the JS downloads and executes. With server-side rendering, we can give them the full HTML immediately so that they can start looking at the page while the JS loads. It also provide a measure of progressive enhancement — if something in the JS fails, at least the user still gets something. And it also allows search engines to crawl your apps, for better SEO.

Currently, with the major JS frameworks, server-side rendering of JavaScript apps is really only possible with React, though Angular and Ember have plans to support it in the future.

This post is a basic introduction for those who are new to the topic and are curious about how it might work. This won’t be a production-ready implementation (there are plenty of starter-kits out there if that’s what you’re looking for), and we won’t deal with loading the JS app in the server-rendered version.

To start with, let’s check out a very simple React app with a couple routes. We’ll use ES6 with [Babel](http://babeljs.io) and [react-router](http://rackt.github.io/react-router/) for routing, of course.

`browser.jsx` will be the starting point for our code when it runs in the browser. It imports our routes, starts up the router, and renders the resulting app into `document.body`.

```javascript
// browser.jsx
import React from 'react';
import Router from 'react-router';
import routes from './routes';

Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
});

```

Here’s our route config, showing our app’s default “Index” route as well as an “About” route.

```javascript
// routes.jsx
import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './app'
import Index from './routes/index';
import About from './routes/about';

export default (
    <Route handler={App}>
        <DefaultRoute name="home" handler={Index} />
        <Route name="about" handler={About} />
    </Route>
);

```

The app component contains the base HTML for the page, which includes links to each route as well as the `RouteHandler`, which is where our route components will be displayed.

```javascript
// app.jsx
import React from 'react';
import {RouteHandler, Link} from 'react-router';

export default class extends React.Component {
    render() {
        return (
            <div>
                <h1>React Isomorphic Demo</h1>
                <nav>
                    Route navigation:
                    <Link to="home">Home</Link> | <Link to="about">About</Link>
                </nav>
                <RouteHandler/>
            </div>
        );
    }
}

```

So far, this is pretty standard for a routed React app. Here’s the result (or open it in a [new window](https://chrisbateman.github.io/react-isomorphic-demo/index.htm)). The HTML file itself contains nothing but a <title> and a <script> tag for our built JS.

Alright, so now let’s render our app on the server. I’m using node.js, but you really could do it with any JavaScript runtime, thanks to React’s virtual DOM. There’s no need to simulate a DOM with [jsdom](https://github.com/tmpvar/jsdom) or [PhantomJS](http://phantomjs.org/) or anything like that.

Below we have a function that will be our server-side equivalent to `browser.jsx`. The difference is that here we specify the exact route we want to render, render the result to a string with `React.renderToStaticMarkup()` and save it, rather than inserting it into `document.body`.

```javascript
// serverrender.js
function renderRoute(routePath, filePath) {
    Router.run(routes, routePath, function(Root, state) {
        var appHtml = React.renderToStaticMarkup(React.createElement(Root));
        fs.writeFile(filePath, fileHeader + appHtml);
    });
}

renderRoute('/', 'dist/server-index.htm');
renderRoute('/about', 'dist/server-about.htm');

```

And here are the resulting HTML pages ([new](https://chrisbateman.github.io/react-isomorphic-demo/server-index.htm) [window](https://chrisbateman.github.io/react-isomorphic-demo/server-about.htm)):

As you can see, they look exactly like the pages in the JS version. Except here, there’s absolutely no JavaScript — it’s just plain HTML (the route links won’t work, by the way, since I haven’t set up those locations).

This is an incredibly simplistic app, but I’m still curious: what’s the difference for performance? Using an iPhone 6 and a stopwatch (so take it with a grain of salt), load times went about like this for me:

*   3G JS: 2.0-2.5s
*   3G server-rendered: 1.0s
*   LTE JS: 1.0s
*   LTE server-rendered: 0.3s

Using [WebPagetest.org](http://webpagetest.org), with a Motorola G on 3G, I got 3.5s for the JS page and 1.5s for server-rendered.

That’s pretty awesome. When [fractions of a second](http://blog.codinghorror.com/performance-is-a-feature/) can make a difference in your site’s success, shaving whole seconds off is a big deal. And the difference will only get more pronounced as an app gets bigger.

The full [source is on GitHub](https://github.com/chrisbateman/react-isomorphic-demo), so feel free to clone it if you want to play around with it.