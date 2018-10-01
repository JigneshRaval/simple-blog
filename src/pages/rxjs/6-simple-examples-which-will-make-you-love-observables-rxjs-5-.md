---
path: "RxJs/6-simple-examples-which-will-make-you-love-observables-rxjs-5-"
date: "2018-09-28"
title: "6 Simple Examples Which Will Make You Love Observables (rxjs 5)"
tags: ["RxJs"]
category: "RxJs"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://x-team.com/blog/rxjs-observables/"
type: "Post"
---

In this article, I want to quickly introduce you to the idea of Observables, using elementary but real-life examples. There will be some basic theory at the beginning, but the rest is just me, you, and Observables. Let the fun begin!

Theory
------

Well, actually, everything I ever wanted to teach about Functional Reactive Programming is this quote:

> Reactive programming is programming with asynchronous data streams.

(It is from the article [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) which I cannot recommend enough)

So that would be it. We just need to explain the words used in that sentence. Imagine you have an app. **If anything in your app happens asynchronously, there is a high chance that an Observable will make that easier for you**. Sounds like an ad for just about any JavaScript library created ever, right? However, there are a few huge pros of Observable which make it exceptionally useful:

*   Observable is just the **observer pattern** with a jetpack
*   Observable is a standard (literally and figuratively). It is being standardized by TC39 ([Proposal Observable](https://tc39.github.io/proposal-observable/)) and will probably become a part of ECMAScript. Moreover, the rxjs library is already well known by the community and widely used
*   Observable allows you to handle different asynchronous events: be that a single finite operation (like _http_ requests) or multiple repeatable actions (like keystrokes or cursor movements). There is a unified API for both.
*   It is also possible to join, mix, transform, filter… different kinds of Observables using one simple API.
*   The cherry on top: Observable is already used with the most popular frameworks and libraries, eg. Angular (built-in) or React/Redux (`redux-observable`)

Practice
--------

Okay, so you are probably still asking yourself: Why should anyone bother with using rxjs? There are plenty of other libraries and patterns, which you already know well and they just do their job.

Yes, that is true. But look at all those examples I have prepared!

### Handling events with Observable

I want to compare the same functionality implemented in vanilla JS and utilizing rxjs 5. Let us imagine that we have a button and whenever the button is clicked, a quasi-random string is generated and displayed. Simple enough?

Just a few lines in Vanilla JS:

```javascript
const button = document.querySelector('button');
const output = document.querySelector('output');

button.addEventListener('click', e => {
  output.textContent = Math.random().toString(36).slice(2);
});

```

And about the same length with Observable:

```javascript
const output = document.querySelector('output');  
const button = document.querySelector('button');

Rx.Observable  
    .fromEvent(button, 'click')
    .subscribe(() => {
        output.textContent = Math.random().toString(36).slice(2);
    });

```

Well, it is actually longer than the vanilla implementation 😂 So why bother? Let me show you why: Let us add another feature to our app! _As a user I want only every 3rd click to generate the random string._

```javascript
Rx.Observable  
  .fromEvent(button, 'click')
  .bufferCount(3) // <--------- only added this line!
  .subscribe(() => {
    output.textContent = Math.random().toString(36).slice(2);
  });

```

So what would a pure JS implementation look like? I shall leave that to you as an exercise. Trust me that it will be longer.

### Operators

So you can see **the true power of rxjs now: The operators**. There are plenty of them and they give you many possibilities. In this case, I just used one operator [`bufferCount`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferCount). It collects (buffers) 3 events and then emits 1 event with an array of buffered events.

But actually, now when I think about it, it was too easy. Let us generate a random string when users click three times in a very short period (400ms). A triple click.

```javascript
const click$ = Rx.Observable.fromEvent(button, 'click');

click$  
  .bufferWhen(() => click$.delay(400)) // <--------- during 400ms
  .filter(events => events.length >= 3) // <-------- 3 or more events
  .subscribe((res) => {
      output.textContent = Math.random().toString(36).slice(2);
  });

```

![wow](https://res.cloudinary.com/dukp6c7f7/image/upload/f_auto,fl_lossy,q_auto/s3-ghost/2017/09/__51-1506710889012.png)

How does it work? Quick explanation: [`bufferWhen`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferWhen) buffers all clicks until the function inside emits something. The function inside emits its first event 400ms after the click. So what it means is that **400ms after the first click, `bufferWhen` emits an array with all the clicks during that time**. Then `filter` is used to only emit anything if there were 3 or more clicks emitted. Brilliant, huh? I think so too. Is it any more interesting now?

### Sources of Observables

Sidenote: I am just using one way of creating Observables with [`fromEvent`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromEvent) method. But there are more! You could, for example, **transform any Promise to an Observable automatically** using [`fromPromise`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromPromise). There are also very useful [`bindCallback`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-bindCallback) and [`bindNodeCallback`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-bindNodeCallback) methods. What I am really trying to say here is: **You can easily use any other library with rxjs thanks to those methods.**

### Observable HTTP requests

Let me reveal another superpower of rxjs: Smooth handling of HTTP requests. Just look at the example below.

Imagine we have another app where we need to fetch a list of albums and render it somehow. I will just go ahead and use the jsonplaceholder API in these examples:

```javascript
const albumsApiUrl = `https://jsonplaceholder.typicode.com/albums`;

Rx.Observable  
  .ajax(albumsApiUrl)
  .subscribe(
    res => console.log(res),
    err => console.error(err)
  );

```

**I added the second parameter to the `subscribe` function which is used for handling errors.** Let us connect this with previous examples: On click, the app will fetch albums of a random user.

```javascript
Rx.Observable  
.fromEvent(button, "click")
.flatMap(getAlbums)
.subscribe(
  render,
  err => console.error(err)
);

function getAlbums() {  
  const userId = Math.round(Math.random() * 10);
  return Rx.Observable.ajax(
    `https://jsonplaceholder.typicode.com/albums?userId=${userId}`
  );
}

```

What we have got here is another operator: [`flatMap`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap) (also called `mergeMap`) which is one of the most useful operators in rxjs. For each click, it calls `getAlbums` and **waits for the results**. Let us see that in action:

It works. There is a caveat, though. Try clicking the button very quickly a few times. Many requests are issued in a short time which will cause troubles. You will not only see an unpleasant effect of re-rendering the results but, what is worse, you cannot be sure which of the requests is actually resolved as the last one. It is a well-known **race condition**.

Solving that properly in pure JS is not trivial. You want to keep just the last request and unsubscribe from the previous ones. Moreover, it would be great to cancel previous requests. Is this something rxjs can help us with? Sure! **There's an operator for that!** Thanks [`switchMap`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-switchMap), you can rest assured **only the response to the last request is rendered, and all previous requests are canceled. This is so powerful!** Let us just replace `flatMap` with `switchMap`:

![Chrome Network tab shows that previous requests have been cancelled](https://res.cloudinary.com/dukp6c7f7/image/upload/f_auto,fl_lossy,q_auto/s3-ghost/2017/09/Screen_Shot_2017_09_29_at_9_24_06_PM-1506713083152.png)

### Combining Observables

This was so awesome and we have learned so much! It is time for the big finale!

We want to give our users the possibility to type in a user ID (`input`) and to select the type of the resource they want to display (`select`). But, what is important is that the request is supposed to be issued only after both fields are filled in. After that, the app should automatically re-render whenever any of the fields is changed. I remember implementing exactly this functionality for my client some time ago!

Let us get straight to the code! To make the code a bit cleaner, let us define our event handlers first. We add event listeners and then map events to values in order to make rest of the code simpler.

```javascript
const id$ = Rx.Observable  
  .fromEvent(input, "input")
  .map(e => e.target.value);

const resource$ = Rx.Observable  
  .fromEvent(select, "change")
  .map(e => e.target.value);

```

(it is a common practice to name variables with the `$` suffix when they hold Observables — are we back in the jQuery era?)

Now we need to combine these observables so that whenever one of them changes, we get the last values from both. **There is an operator for that!** Well, actually, there are plenty of operators for that 🙃 But we use [`combineLatest`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-combineLatest) which does exactly what we want:

```javascript
Rx.Observable  
  .combineLatest(id$, resource$)
  .switchMap(getResources)
  .subscribe(render);

```

And… that is it! 🍾 See the result:

Summary
-------

The most important question is: **Did you enjoy using Observable?** If the answer is "yes ❤️" then you should definitely dig deeper. You should definitely start with the article [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) — it made a lot of things much clearer for me.

If, on the other hand, the answer is "no 💩" I still recommend that you get familiar with the concept since it is coming to JS as a native global object 👍

Either way, I hope you learned something new today. If you have any questions please leave a comment! Do not hesitate to find me on social media (I am basically everywhere) and say hello. I will be happy to help! 👍

Bonus
-----

Replace id$ with the code below and see what happens. Why? Is it better?

```javascript
const id$ = Rx.Observable  
  .fromEvent(input, "input")
  .map(e => e.target.value)
  .filter(id => id >= 1 && id <= 10)
  .distinctUntilChanged()
  .debounceTime(200);

```