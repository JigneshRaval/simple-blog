---
path: "JavaScript/how-to-conditionally-build-an-object-in-javascript-with-es6"
date: "2018-09-25"
title: "How to conditionally build an object in JavaScript with ES6"
tags: ["JavaScript","ES6"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: "Moving user-generated data between sources often requires you to check if a field has values or not."
coverImage: "https://cdn-images-1.medium.com/max/800/1*_CMG7dT4YMldUiVPueOmXw.png"
sourceUrl: "https://medium.freecodecamp.org/how-to-conditionally-build-an-object-in-javascript-with-es6-e2c49022c448"
type: "Post"
---

![](https://cdn-images-1.medium.com/max/800/1*_CMG7dT4YMldUiVPueOmXw.png)

Moving user-generated data between sources often requires you to check if a field has values or not. You then build the output based on that. This is how you can use some of the ES6 features in JavaScript to do it more concisely.

Since [Sanity.io](https://sanity.io) (where I work) sponsored [Syntax](https://syntax.fm/show/068/design-tips-for-developers), I've been tinkering with RSS-feeds for podcasts in [CLIs](https://github.com/sanity-io/podcast-to-sanity), [Express, and Serverless functions.](https://github.com/sanity-io/Syntax) This involves parsing and constructing complex objects with lots of fields and information. Since you're dealing with user-generated data from different sources, you aren't guaranteed the fields are populated all the time. Some fields are optional as well. And you don't want to output tags with no values in a RSS XML or [JSON FEED](https://jsonfeed.org).

Earlier I would deal with this by applying new keys on an object like this:

```
function episodeParser(data) {
  const { id,
   title,
   description,
   optionalField,
   anotherOptionalField
  } = data
  const parsedEpisode = { guid: id, title, summary: description }
  if (optionalField) {
    parsedEpisode.optionalField = optionalField
  } else if (anotherOptionalField) {
    parsedEpisode.anotherOptionalField = anotherOptionalField
  }
  // and so on
  return parsedEpisode
}
```

This isn't exactly smooth (but it works), and if you have a lot of fields, you soon end up with a lot of `if-` statements. I could also do nifty things with looping the object keys and so on. That would mean code that's a bit more convoluted and you don't get a good sense of what the data object is either.

Yet again, new syntax in ES6 comes to the rescue. I found a pattern where I was able to rewrite the code over to something like this:

```
function episodeParser({
  id,
  title,
  description = 'No summary',
  optionalField,
  anotherOptionalField
}) {
  return {
    guid: id,
    title,
    summary: description,
    ...(optionalField && {optionalField}),
    ...(anotherOptionalField && {anotherOptionalField})
  }
}
```

This function has a couple of features. The first is [**parameter object destructuring**](https://www.youtube.com/watch?v=-vR3a11Wzt0), which is a good pattern if you want to deal with lots of arguments in a function. So instead of this pattern:

```
function episodeParser(data) {
  const id = data.id
  const title = data.title
  // and so on...
}
```

You write:

```
function({id, title}) {
  // and so on...
}
```

This is also a good way of avoiding having many multiple arguments in a function. Note also the `description = 'No summary'` part of the object destructuring. This is what we call parameter defaulting. It means that if `description` is undefined, it will be defined with the string `No summary` as a fallback.

The second is the three dots [**spread syntax**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (`...`). It is used to “unwrap” the object if the condition is true-ish (that's what the `&&` are for):

```
{
  id: 'some-id',
  ...(true && { optionalField: 'something'})
}

// is the same as

{
  id: 'some-id',
  optionalField: 'someting'
}
```

What you end up with is a neat concise function which is also easy to test. One important caveat with using the `&&` operator is that the number 0 will be considered `false`. So you have to pay attention to your datatypes going in.

If we put the function into action, it would look something like this:

```
const data = {
  id: 1,
  title: 'An episode',
  description: 'An episode summary',
  anotherOptionalField: 'some data'
}
episodeParser(data)
//> { guid: 1, title: 'An episode', summary: 'An episode summary', anotherOptionalField: 'some data' }
```

You can see it in action in our podcast feeds implementation for [express.js](https://github.com/sanity-io/Syntax/blob/master/routeHandlers/rss.js) and [netlify lambdas](https://github.com/sanity-io/Syntax/blob/master/functions/rss.js). If you want to try Sanity.io for these implementations yourself,  you can go to [sanity.io/freecodecamp](https://sanity.io/freecodecamp?utm_source=freecodecamp&utm_medium=blog&utm_campaign=jq) and get an upped free developer plan. ✨
