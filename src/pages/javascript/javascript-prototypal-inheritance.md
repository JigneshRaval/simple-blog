---
path: "JavaScript/javascript-prototypal-inheritance"
date: "2018-10-05"
title: "JAVASCRIPT PROTOTYPAL INHERITANCE"
tags: ["JavaScript","inheritance","Prototype"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: "JAVASCRIPT IS QUITE UNIQUE IN THE POPULAR PROGRAMMING LANGUAGES LANDSCAPE BECAUSE OF ITS USAGE OF PROTOTYPAL INHERITANCE. LET'S FIND OUT WHAT THAT MEANS"
coverImage: ""
sourceUrl: "https://flaviocopes.com/javascript-prototypal-inheritance/"
type: "Post"
---

JavaScript is quite unique in the popular programming languages landscape because of its usage of prototypal inheritance.

While most object-oriented languages use a class-based inheritance model, JavaScript is based on the prototype inheritance model.

What does this mean?

Every single JavaScript object has a property, called `prototype`, which points to a different object.

This different object is the **object prototype**.

Our object uses that object prototype to inherit properties and methods.

Say you have an object created using the object literal syntax:

```js
const car = {}

```

or one created with the `new Object` syntax:

```js
const car = new Object()

```

in any case, the prototype of `car` is `Object`:

If you initialize an array, which is an object:

```js
const list = []
//or
const list = new Array()

```

the prototype is `Array`.

You can verify this by checking the `__proto__` getter:

```js
car.__proto__ == Object.prototype //true
car.__proto__ == new Object().__proto__ //true
list.__proto__ == Object.prototype //false
list.__proto__ == Array.prototype //true
list.__proto__ == new Array().__proto__ //true

```

> I use the `__proto__` property here, which is non-standard but widely implemented in browsers. A more reliable way to get a prototype is to use `Object.getPrototypeOf(new Object())`

All the properties and methods of the prototype are available to the object that has that prototype:

![](Screen Shot 2018-07-20 at 00.11.55.png)

`Object.prototype` is the base prototype of all the objects:

```js
Array.prototype.__proto__ == Object.prototype

```

If you wonder what’s the prototype of the Object.prototype, there is no prototype. It’s a special snowflake ❄️.

The above example you saw is an example of the **prototype chain** at work.

I can make an object that extends Array and any object I instantiate using it, will have Array and Object in its prototype chain and inherit properties and methods from all the ancestors.

In addition to using the `new` operator to create an object, or using the literals syntax for objects and arrays, you can instantiate an object using `Object.create()`.

The first argument passed is the object used as prototype:

```js
const car = Object.create({})
const list = Object.create(Array)

```

You can check the prototype of an object using the `isPrototypeOf()` method:

```js
Array.isPrototypeOf(list) //true

```

Pay attention because you can instantiate an array using

```js
const list = Object.create(Array.prototype)

```

and in this case `Array.isPrototypeOf(list)` is false, while `Array.prototype.isPrototypeOf(list)` is true.