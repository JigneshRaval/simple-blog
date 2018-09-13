---
path: "a-practical-guide-to-static-sites-with-gatsby-js"
date: "2018-05-20"
title: "Zero to Deploy: A Practical Guide to Static Sites with Gatsby.js"
tags: ["React", "Gatsby", "Static Site"]
category: "Static Site"
categoryColor: '#F3C610'
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app. When a website requires no server interaction whatsoever, what is hosted on the web is served to a user as is, this is referred to as a static site."
coverImage: '/assets/images/paper_boat_by_eredel.jpg'
sourceUrl: 'https://scotch.io/tutorials/zero-to-deploy-a-practical-guide-to-static-sites-with-gatsbyjs'
type: 'Post'
---

Since the advent of the modern web, performance has been a key consideration when designing a website or a web app. When a website requires no server interaction whatsoever, what is hosted on the web is served to a user as is, this is referred to as a static site.

In this post, we will simply be explaining the basics of Gatsby.js and build out a simple static blog in the process. The Blog will be deployed to the web using [Netlify](https://www.netlify.com/). Blog posts will be written in [Markdown](https://daringfireball.net/projects/markdown/syntax) and [GraphQL](http://graphql.org/) will be used to query markdown data into the blog. The final product will look like this:

![](https://d2mxuefqeaa7sj.cloudfront.net/s_020D9387EE03B48A260C52B5FB6CBFFC0E93605E50CF07CE041D3BA39114C884_1516929203704_gatsby-blog-giphy.gif)

### Table of Contents

1.  [What is a Static Site?](#what-is-a-static-site "What is a Static Site?")
2.  [Introducing Gatsby.js](#introducing-gatsbyjs "Introducing Gatsby.js")
3.  [Prerequisites](#prerequisites "Prerequisites")
4.  [Installation](#installation "Installation")
5.  [Layout](#layout "Layout")
6.  [Create Blog Posts](#create-blog-posts "Create Blog Posts")
7.  [Querying Posts with GraphQL](#querying-posts-with-graphql "Querying Posts with GraphQL")
8.  [Creating Blog Pages](#creating-blog-pages "Creating Blog Pages")
9.  [Creating The Blog Template](#creating-the-blog-template "Creating The Blog Template")
10.  [Deploy Blog to Netlify](#deploy-blog-to-netlify "Deploy Blog to Netlify")
11.  [Conclusion](#conclusion "Conclusion")

## [# What is a Static Site?](#toc-what-is-a-static-site)

A static site is a site which contains fixed content. In several use cases including event listings, portfolio pages and blogs, static sites are preferred to dynamic websites (requiring client-server interaction) because of challenges including slow load-time, security flaws, and hosting costs amongst others. The absence of a server mitigates these risks. Static Site Generators are tools used develop static sites, effectively and efficiently. Recently the use of static sites is on the rise and various tools and technologies such as Metalsmith, Jekyll, and Gatsby are taking center stage.

## [# Introducing Gatsby.js](#toc-introducing-gatsbyjs)

Gatsby is simply a robust and fast static site generator which uses React.js to render static content on the web. Content is written as React components and is rendered at build time to the DOM as static HTML, CSS and JavaScript files. By default, Gatsby builds a PWA. Like most static site generators, Gatsby requires plugins to either extend its functionality or modify existing functionality.

Gatsby is said to be robust in a way that the static content rendered can be sourced from a large number of sources and formats including markdown, CSV and from CMS like Wordpress and Drupal. All that is required are plugins to handle the data transformation. Plugins in Gatsby are of three categories.

*   Functional Plugins: These plugins simply extend the ability of Gatsby. An example is the gatsby-plugin-react-helmet which allows the manipulation of the Head of our document.
*   Source Plugins: This plugin ‘finds’ files in a Gatsby project and creates File Nodes for each of this files, these files can then be manipulated by transformer plugins. An example is the gatsby-source-filesystem which ‘sources’ files in the filesystem of a Gatsby project and creates File Nodes containing information about the file.
*   Transformer Plugins: Like we saw earlier, data in Gatsby can come from multiple sources and transformer plugins are responsible for converting these files to formats recognizable by Gatsby. An example is the gatsby-transformer-remark plugin which converts Markdown File Nodes from the filesystem into MarkdownRemark which can be utilized by Gatsby. Other plugins exist for various data sources and you can find them [here](https://www.gatsbyjs.org/docs/plugins/).

    ## [# Prerequisites](#toc-prerequisites)

    To build out this blog, knowledge of HTML, CSS, and JavaScript is required with a focus on ES6 Syntax and JavaScript Classes. Basic knowledge of React and GraphQL is also of advantage.

    ## [# Installation](#toc-installation)

    Since this is a node.js project, Node and its package manager NPM are required. Verify if they are installed on your machine by checking the current version of both tools with:


```bash
node -v && npm -v
```

Else, install Node from [here](https://nodejs.org/en/).

Gatsby offers a powerful CLI tool for a faster build of static sites. The Gatsby CLI installs packages known as ‘starters’. These starters come as pre-packaged projects with essential files to speed up the development process of the static site. Install the Gatsby CLI with:

Related Course: [Getting Started with JavaScript for Web Development](https://bit.ly/2rVqDcs)

```bash
npm install -g gatsby-cli
```

This installs the CLI tool, then proceed to create a new project with the Gatsby default starter.

```bash
gatsby new scotch-blog
```

This should take a while as the tool downloads the starter and runs `npm install` to install all dependencies.

Once the installation is complete change directory to the project folder and start the development server with:

```bash
cd scotch-blog && gatsby develop
```

This starts a local server on port 8000.

The web page looks like:

Gatsby’s default starter comes with all essential files we require for development. You can find other starters [here](https://www.gatsbyjs.org/docs/gatsby-starters/) and even create or contribute to a starter.

For a simple blog all we require are:

1.  Have a blog homepage.
2.  Write blog posts in markdown.
3.  Display blog post titles on the homepage.
4.  View each blog post on a separate page.

For these, we will require the three plugins we stated earlier to which will manipulate the `<head />` element of our blog, source markdown files and transform markdown files respectively. All styling will be done via external CSS files and in-line component styling in React, however, several other methods of styling Gatsby documents exist such as CSS modules, typography.js, and CSS-in-JS. You can read more about them [here](https://www.gatsbyjs.org/tutorial/part-two/#creating-global-styles).

Install required plugins with:

```bash
npm install --save gatsby-transformer-remark gatsby-source-filesystem
```

> Note: The gatsby-plugin-react-helmet comes preinstalled with the default Gatsby starter

**Configure Plugins** Before we go ahead to create pages, let’s configure the installed plugins. Navigate to gatsby-config.js in the root directory of your project and edit it to:

```js
module.exports = {
  siteMetadata: {
    title: 'The Gray Web Blog',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-remark',
    {
      resolve: `gatsby-source-filesystem`,
      options:{
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
  ],
};
```

Gatsby runs the gatsby-config.js during build and implements all installed plugins. One great thing about Gatsby is that it comes with a hot reload feature so changes made on the source files are immediately visible on the website rendered.

> Note the siteMetadata in the gatsby-config module, this can be used to set the value of any element dynamically using GraphQL, for instance - document title and page title.

## [# Layout](#toc-layout)

One key design feature considered during development is the layout of pages. This consist of any element we would like to be consistent across all pages. They include headers, footers, navbars e.t.c. For our blog, the default Gatsby starter provides a default layout which is found in `src/layouts`. To make some changes to the header, edit the index.js file in layouts. first import all required dependencies with:

```js
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Header from '../components/Header'
import './index.css'
```

> Note the imported CSS file. Gatsby supports the use of external stylesheets to style React components.

Edit the React component to:

```js
const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="The Gray Web Blog"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Header />
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children()}
    </div>
  </div>
)
TemplateWrapper.propTypes = {
  children: PropTypes.func,
}
export default TemplateWrapper
```

`<Helmet/>` is a component provided by the react-helmet plugin shipped originally with Gatsby’s default starter. A `Header` component is imported and the `div` to contain all page elements is styled in-line. Gatsby offers the flexibility of creating custom components in react and these components can as well be stateful or stateless. We will stick to using stateless components in this tutorial, like the `<Header/>` component.

Navigate to the header component in `src/components/header/index.js` edit it to:

```js
const Header = () => (
  <div
    style={{
      background: 'black',
      marginBottom: '1.45rem',
      marginTop:'0px',
      display:'block',
      boxShadow:'0px 0px 7px black',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0, textAlign:'center' }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          The Gray Web Blog
        </Link>
      </h1>
    </div>
  </div>
)
export default Header
```

We simply made some changes to the styling by changing the background color of the header and aligning the header text to the center.

So far we have created the layout of the blog, how about we do some cool stuff by creating blog posts and displaying them on the home page.

## [# Create Blog Posts](#toc-create-blog-posts)

Blog posts are created in markdown as earlier stated. In `src`, create a folder titled `blog-posts`. This will house all blog posts to be served. Create three sample markdown files with titles. We have:

**basic-web-development.md**

```md
  ---
  title: "Basic Web Development dfsfsfs"
  date: "2018-01-01"
  author: "Chris Ashî"
  ---
  Web development is a broad term for the work involved in developing a web site for the Internet (World Wide Web) or an intranet (a private network). Web development can range from developing the simplest static single page of plain text to the most complex web-based internet applications (or just 'web apps') electronic businesses, and social network services. A more comprehensive list of tasks to which web development commonly refers, may include web engineering, web design, web content development, client liaison, client-side/server-side scripting, web server and network security configuration, and e-commerce development.
```

**in-the-beginning.md**

```md
---
title: "The Beginning of The Web"
date: "2018-01-10"
author: "Chuloo Will"
---
The World Wide Web ("WWW" or simply the "Web") is a global information medium which users can read and write via computers connected to the Internet. The term is often mistakenly used as a synonym for the Internet itself, but the Web is a service that operates over the Internet, just as e-mail also does. The history of the Internet dates back significantly further than that of the World Wide Web. - Wikipedia
```

and

**vue-centered.md**

```md
---
title: "Common Vue.js"
date: "2017-12-05"
author: "Alex Chî"
---
Vue.js (commonly referred to as Vue; pronounced /vjuː/, like view) is an open-source progressive JavaScript framework for building user interfaces.[4] Integration into projects that use other JavaScript libraries is made easy with Vue because it is designed to be incrementally adoptable. Vue can also function as a web application framework capable of powering advanced single-page applications. - Wikipedia
```

The texts between the triple dashes are known as frontmatter and provide basic information about the markdown post. We have our markdown post, to render this data, we would employ GraphQL.

## [# Querying Posts with GraphQL](#toc-querying-posts-with-graphql)

GraphQL is a powerful yet simple query language. Since its introduction, it is fast gaining popularity and has become a widely used means of consuming data in React. Gatsby ships with GraphQL by default. Since we have previously installed the `gatsby-source-filesystem` plugin, all files can be queried with GraphQL and are visible as File Nodes.

GraphQL also comes with an important tool called GraphiQL an IDE with which we visualize and manipulate our data before passing it to React components. GraphiQL is available on `http://localhost:8000/___graphql` while the Gatsby server is running. Open up GraphiQL on that address to visualize data.

Run the query to see all files in `/src/`.

```js
{
  allFile {
    edges {
      node {
        id
      }
    }
  }
}
```

This returns a list of all files in our `src` directory as we already specified that when configuring the `gatsby-source-filesystem` in the gatsby-config.js file. We have all the files in our source folder but we need only the markdown files and their accompanying data like frontmatter and size. The `gatsby-transformer-remark` plugin earlier installed comes in handy now.

The plugin transforms all markdown file nodes into MarkdownRemark nodes which can be queried for their content.

Run this query in GraphiQL to fetch all MarkdownRemark nodes and usable data in them.

```js
{
  allMarkdownRemark {
    totalCount
    edges {
        node {
          frontmatter {
            title
            date
            author
          }
          excerpt
          timeToRead
        }
    }
  }
}
```

Running this query in GraphiQL will return a list of all markdown files and their corresponding data in a JSON object as requested. To pass this data to our page component, navigate to index.js in `src/pages` which holds the homepage. First, import all required dependencies as well as external stylesheets with:

```js
import React from 'react'
import Link from 'gatsby-link'
import './index.css'
...
```

Create and export an IndexPage stateless component and pass the data object to it as an argument:

```js
const IndexPage = ({data}) => {
  console.log(data)
  return(
  <div>
    {data.allMarkdownRemark.edges.map(({node}) => (
      <div key={node.id} className="article-box">
        <h3 className="title">{node.frontmatter.title}</h3>
        <p className="author">{node.frontmatter.author}</p>
        <p className="date">{node.frontmatter.date} {node.timeToRead}min read</p>
        <p className="excerpt">{node.excerpt}</p>
      </div>
    ))}
  </div>
  )
}
export default IndexPage
```

The `.map()` method is used to traverse the data object for data to be passed to the components elements. We passed the title, author, date, time to read and excerpt to various JSX elements. We still haven’t queried this data. After the export statement create a GraphQL query with:

```js
export const  query = graphql`
query HomePageQuery{
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    edges {
      node {
        frontmatter {
          title
          date
          author
        }
        excerpt
        timeToRead
      }
    }
  }
}
`
```

The `sort` query is used to sort articles by date in an ascending order so we have the earliest article on top. In `src/pages/`, create the CSS file imported with:

```css
.article-box{
    margin-bottom: 1.5em;
    padding: 2em;
    box-shadow: 0px 0px 6px grey;
    font-family: 'Helvetica';
}
.title{
    font-size: 2em;
    color: grey;
    margin-bottom: 0px;
}
.author, .date{
    margin:0px;
}
.date{
    color: rgb(165, 164, 164);
}
.excerpt{
    margin-top: 0.6em;
}
```

Restart the development server and we have:

Alas, we have an awesome blog page with details and excerpt from the post content. We need to view each blog post on a separate page, let’s do that next.

## [# Creating Blog Pages](#toc-creating-blog-pages)

This is just about the best part of building out this blog, but also a bit complex. We could actually create individual pages in `src/pages`, pass the markdown content to the document body and link the pages to the blog titles but that would be grossly inefficient. We would be creating these pages automatically from any markdown post in `src/blog-posts`.

To accomplish this, we will require two important APIs which ship with Gatsby and they are:

*   onCreateNode
*   createPages

We will simply be creating a ‘path’ otherwise known as ‘slug’ for each page and then creating the page itself from its slug. APIs in Gatsby are utilized by exporting a function from the Gatsby-node.js file in our root directory.

In Gatsby-node.js, export the `onCreateNode` function and create the file path from each File node with:

```js
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
...
```

The `createFilePath` function ships with the `gatsby-source-filesystem` and enables us to create a file path from the File nodes in our project. First, a conditional statement is used to filter only the markdown file nodes, while the `createFilePath` creates the slug for each File node. The `createNodeField` function from the API adds the slug as a field to each file node, in this case, Markdown File nodes. This new field created(slug) can then be queried with GraphQL.

While we have a path to our page, we don’t have the page yet. To create the pages, export the `createPages` API which returns a Promise on execution.

```js
const path = require(`path`)
...
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/posts.js`),
          context: {
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  })
}
```

In the `createPages` API, a promise is returned which fetches the slugs created using a GrphQL query and then resolves to create a page with each slug. The `createPage` method, creates a page with the specified path, component, and context. The path is the slug created, the component is the React component to be rendered and the context holds variables which will be available on the page if queried in GraphQL.

## [# Creating The Blog Template](#toc-creating-the-blog-template)

To create the blog template, navigate to `/src/` and create a folder called templates with a file named posts.js in it. In post.js, import all dependencies and export a functional component with:

```js
import React from "react";
export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <h4 style={{color: 'rgb(165, 164, 164)'}}>{post.frontmatter.author} <span style={{fontSize: '0.8em'}}> -{post.frontmatter.date}</span></h4>
      <div dangerouslySetInnerHTML = {{ __html: post.html }}/>
    </div>
  );
};
```

You can see GraphQL data already being consumed, query the data using GraphQL with:

```js
export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        author
        date
      }
    }
  }
`;
```

We have our blog pages and the content. Lastly, link the post titles in the homepage to their respective pages. In `src/pages/index.js`, edit the post title header to include the link to the post content:

```js
...
<Link to={node.fields.slug} style={{textDecoration: 'none', color: 'inherit'}}><h3 className="title">{node.frontmatter.title}</h3></Link>
...
```

Since we require data on the slug, edit the GraphQL query to include the slug:

```js
export const  query = graphql`
query HomePageQuery{
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    edges {
      node {
        fields{
          slug
        }
        frontmatter {
          title
          date
          author
        }
        excerpt
        timeToRead
      }
    }
  }
}
`
```

Yikes, our static blog is ready, restart the development server and we have:

Running `Gatsby build` will create a production build of your site in the public directory with static HTML files and JavaScript bundles.

## [# Deploy Blog to Netlify](#toc-deploy-blog-to-netlify)

So far we have built out a simple static blog with blog content and pages. It will be deployed using Netlify and Github for continuous deployment. Netlify offers a free tier which allows you deploy static sites on the web.

> Note: Pushing code to Github and deploying to Netlify from Github ensures that once a change is made to the repository on Github, the updated code is served by Netlify on build.

Create an account with Github and Netlify. In Github, create an empty repository and push all files from your project folder to the repository.

Netlify offers a login option with Github. Log into Netlify with your Github account or create a new account with Netlify. Click the ‘New site from Git’ button and select your Git provider.

Github is the chosen Git Provider in this case.

Select Github and choose the repository you wish to deploy, in this case, the repository for the static blog. Next, specify the branch to deploy from, build command, and publish directory.

Click the ‘Deploy site’ Button to deploy the static site. This may take few minutes to deploy after which the static site is deployed to a Netlify sub-domain. Here is the demo of the static blog built earlier. [https://vigilant-bhaskara-66ed6e.netlify.com/](https://vigilant-bhaskara-66ed6e.netlify.com/).

## [# Conclusion](#toc-conclusion)

In this post, you have been introduced to building a static site with Gatsby which utilizes React components to generate static content on build. Gatsby offers a robust approach to static site generation with the ability to parse data from various sources with the help of plugins. The static site was also deployed to the web using Netlify. Feel free to try out other amazing features of Gatsby including the various styling techniques as well. Comments and suggestions are welcome and you can make contributions to the source code [here](https://github.com/Chuloo/Gatsby-Scotch-Blog).
