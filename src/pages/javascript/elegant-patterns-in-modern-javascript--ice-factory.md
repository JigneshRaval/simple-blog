---
path: "JavaScript/elegant-patterns-in-modern-javascript--ice-factory"
date: ""
title: "Elegant patterns in modern JavaScript: Ice Factory"
tags: ["JavaScript","Pattern"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app."
coverImage: "https://cdn-images-1.medium.com/max/1000/1*ZO7AoQIo9jFTGGUeSsFxuQ.jpeg"
sourceUrl: "https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-ice-factory-4161859a0eee"
type: "Post"
---


I’ve been working with JavaScript on and off since the late nineties. I didn’t really like it at first, but after the introduction of ES2015 (aka ES6), I began to appreciate JavaScript as an outstanding, dynamic programming language with enormous, expressive power.

Over time, I’ve adopted several coding patterns that have lead to cleaner, more testable, more expressive code. Now, I am sharing these patterns with you.

I wrote about the first pattern — “RORO” — in the article below. Don’t worry if you haven’t read it, you can read these in any order.

[**Elegant patterns in modern JavaScript: RORO**
_I wrote my first few lines of JavaScript not long after the language was invented. If you told me at the time that I…_medium.freecodecamp.org](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd "https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd")[](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd)

Today, I’d like to introduce you to the “Ice Factory” pattern.

An Ice Factory is just **a function that creates and returns a frozen object**. We’ll unpack that statement in a moment, but first let’s explore why this pattern is so powerful.

### JavaScript classes are not so classy

It often makes sense to group related functions into a single object. For example, in an e-commerce app, we might have a `cart` object that exposes an `addProduct` function and a `removeProduct` function. We could then invoke these functions with `cart.addProduct()` and `cart.removeProduct()`.

If you come from a Class-centric, object oriented, programming language like Java or C#, this probably feels quite natural.

If you’re new to programming — now that you’ve seen a statement like `cart.addProduct()`. I suspect the idea of grouping together functions under a single object is looking pretty good.

So how would we create this nice little `cart` object? Your first instinct with modern JavaScript might be to use a `class`. Something like:

// ShoppingCart.js

export default class ShoppingCart {
  constructor({db}) {
    this.db = db
  }

  addProduct (product) {
    this.db.push(product)
  }

  empty () {
    this.db = \[\]
  }

  get products () {
    return Object
      .freeze(\[...this.db\])
  }

  removeProduct (id) {
    // remove a product
  }

  // other methods

}

// someOtherModule.js

const db = \[\]
const cart = new ShoppingCart({db})
cart.addProduct({
  name: 'foo',
  price: 9.99
})

> **_Note_**_: I’m using an Array for the_ `_db_` _parameter for simplicity’s sake. In real code this would be something like a_ [_Model_](http://mongoosejs.com/docs/models.html) _or_ [_Repo_](https://reallyshouldblogthis.blogspot.ca/2016/02/writing-pure-javascript-repository.html) _that interacts with an actual database._

Unfortunately — even though this looks nice — classes in JavaScript behave quite differently from what you might expect.

JavaScript Classes will bite you if you’re not careful.

For example, objects created using the `new` keyword are mutable. So, you can actually **re-assign** a method:

    const db = \[\]
    const cart = new ShoppingCart({db})

    cart.addProduct = () => 'nope!'
    // **No Error on the line above!**

    cart.addProduct({
      name: 'foo',
      price: 9.99
    }) // **output: "nope!" FTW?**

Even worse, objects created using the `new` keyword inherit the `prototype` of the `class` that was used to create them. So, changes to a class’ `prototype` affect **all** objects created from that `class` — even if a change is made **after** the object was created!

Look at this:

    const cart = new ShoppingCart({db: \[\]})
    const other = new ShoppingCart({db: \[\]})

    ShoppingCart.**prototype** .addProduct = () => ‘nope!’
    // **No Error on the line above!**

    cart.addProduct({
      name: 'foo',
      price: 9.99
    }) // **output: "nope!"**

    other.addProduct({
      name: 'bar',
      price: 8.88
    }) // **output: "nope!"**

Then there's the fact that `this` In JavaScript is dynamically bound. So, if we pass around the methods of our `cart` object, we can lose the reference to `this`. That’s very counter-intuitive and it can get us into a lot of trouble.

A common trap is assigning an instance method to an event handler.

Consider our `cart.empty` method.

    empty () {
      this.db = \[\]
    }

If we assign this method directly to the `click` event of a button on our web page…

    &lt;button id="empty">
      Empty cart
    &lt;/button>

    \---

    document
      .querySelector('#empty')
      .addEventListener(
        'click',
        cart.empty
      )

… when users click the empty `button`, their `cart` will remain full.

It **fails silently** because `this` will now refer to the `button` instead of the `cart`. So, our `cart.empty` method ends up assigning a new property to our `button` called `db` and setting that property to `[]` instead of affecting the `cart` object’s `db`.

This is the kind of bug that will drive you crazy because there is no error in the console and your common sense will tell you that it should work, but it doesn’t.

To make it work we have to do:

    document
      .querySelector("#empty")
      .addEventListener(
        "click",
        **() => cart.empty()**
      )

Or:

    document
      .querySelector("#empty")
      .addEventListener(
        "click",
        **cart.empty.bind(cart)**
      )

I think [Mattias Petter Johansson](https://medium.com/@mpjme) [said it best](https://youtu.be/ImwrezYhw4w):

> _“_`_new_` _and_ `_this_` _\[in JavaScript\] are some kind of unintuitive, weird, cloud rainbow trap.”_

### Ice Factory to the rescue

As I said earlier, **an Ice Factory is just a function that creates and returns a frozen object**. With an Ice Factory our shopping cart example looks like this:

    // makeShoppingCart.js

    export default function makeShoppingCart({
      db
    }) {
      return Object.freeze({
        addProduct,
        empty,
        getProducts,
        removeProduct,
        // others
      })

      function addProduct (product) {
        db.push(product)
      }

      function empty () {
        db = \[\]
      }

      function getProducts () {
        return Object
          .freeze(\[...db\])
      }

      function removeProduct (id) {
        // remove a product
      }

      // other functions
    }

    // someOtherModule.js

    const db = \[\]
    const cart = makeShoppingCart({ db })
    cart.addProduct({
      name: 'foo',
      price: 9.99
    })

Notice our “weird, cloud rainbow traps” are gone:

*   **We no longer need** `**new**`**.**
    We just invoke a plain old JavaScript function to create our `cart` object.
*   **We no longer need** `**this**`**.**
    We can access the `db` object directly from our member functions.
*   **Our** `**cart**` **object is completely immutable.**
    `Object.freeze()` freezes the `cart` object so that new properties can’t be added to it, existing properties can’t be removed or changed, and the prototype can’t be changed either. Just remember that `Object.freeze()` is **shallow**, so if the object we return contains an `array` or another `object` we must make sure to `Object.freeze()` them as well. Also, if you’re using a frozen object outside of an [ES Module](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/), you need to be in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) to make sure that re-assignments cause an error rather than just failing silently.

### A little privacy please

Another advantage of Ice Factories is that they can have private members. For example:

    function makeThing(spec) {
      **const secret = 'shhh!'**

      return Object.freeze({
        doStuff
      })

      function doStuff () {
        // We can use both spec
        // and secret in here
      }
    }

    **// secret is not accessible out here**

    const thing = makeThing()
    thing.secret // undefined

This is made possible because of Closures in JavaScript, which you can read more about on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

### A little acknowledgement please

Although Factory Functions have been around JavaScript forever, the Ice Factory pattern was heavily inspired by some code that [Douglas Crockford](https://en.wikipedia.org/wiki/Douglas_Crockford) showed in [this video](https://www.youtube.com/watch?v=rhV6hlL_wMc).

Here’s Crockford demonstrating object creation with a function he calls “constructor”:
