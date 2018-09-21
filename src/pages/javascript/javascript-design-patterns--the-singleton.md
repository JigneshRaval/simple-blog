---
path: "JavaScript/javascript-design-patterns--the-singleton"
date: "2018-09-20"
title: "JavaScript Design Patterns: The Singleton"
tags: ["JavaScript","Pattern"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app."
coverImage: ""
sourceUrl: "https://www.sitepoint.com/javascript-design-patterns-singleton/"
type: "Post"
---

**In this article, we’ll dig into the best way to implement a singleton in JavaScript, looking at how this has evolved with the rise of ES6.**

Among languages used in widespread production, JavaScript is by far the most quickly evolving, looking less like its earliest iterations and more like Python, with every new spec put forth by ECMA International. While the changes have their fair share of detractors, the new JavaScript does succeed in making code easier to read and reason about, easier to write in a way that adheres to software engineering best practices (particularly the concepts of modularity and SOLID principles), and easier to assemble into canonical software design patterns.

Explaining ES6
--------------

ES6 (aka ES2015) was the first major update to the language since ES5 was standardized in 2009. [Almost all modern browsers support ES6](https://kangax.github.io/compat-table/es6/). However, if you need to accommodate older browsers, ES6 code can easily be transpiled into ES5 using a tool such as Babel. ES6 gives JavaScript a ton of new features, including [a superior syntax for classes](https://www.sitepoint.com/object-oriented-javascript-deep-dive-es6-classes/), and [new keywords for variable declarations](https://www.sitepoint.com/preparing-ecmascript-6-let-const/). You can learn more about it by perusing [SitePoint articles on the subject](https://www.sitepoint.com/JavaScript/es6/).

What Is a Singleton
-------------------

![9 Puzzle pieces. 8 are gray, 1 is red. A visual representation of the singleton pattern](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/06/1466406405singleton-300x295.jpg)

In case you’re unfamiliar with the [singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern), it is, at its core, a design pattern that restricts the instantiation of a class to one object. Usually, the goal is to manage global application state. Some examples I’ve seen or written myself include using a singleton as the source of config settings for a web app, on the client side for anything initiated with an API key (you usually don’t want to risk sending multiple analytics tracking calls, for example), and to store data in memory in a client-side web application (e.g. stores in Flux).

A singleton should be immutable by the consuming code, and there should be no danger of instantiating more than one of them.

_Note: there are scenarios when singletons might be bad, and arguments that they are, in fact, always bad. For that discussion, you can check out [this helpful article](https://www.sitepoint.com/whats-so-bad-about-the-singleton/) on the subject._

The Old Way of Creating a Singleton in JavaScript
-------------------------------------------------

The old way of writing a singleton in JavaScript involves leveraging [closures and immediately invoked function expressions](https://www.sitepoint.com/demystifying-javascript-closures-callbacks-iifes/) . Here’s how we might write a (very simple) store for a hypothetical Flux implementation the old way:

    var UserStore = (function(){
      var _data = [];

      function add(item){
        _data.push(item);
      }

      function get(id){
        return _data.find((d) => {
          return d.id === id;
        });
      }

      return {
        add: add,
        get: get
      };
    }());


When that code is interpreted, `UserStore` will be set to the result of that immediately invoked function — an object that exposes two functions, but that does not grant direct access to the collection of data.

However, this code is more verbose than it needs to be, and also doesn’t give us the immutability we desire when making use of singletons. Code executed later could modify either one of the exposed functions, or even redefine `UserStore` altogether. Moreover, the modifying/offending code could be anywhere! If we got bugs as a result of unexpected modification of `UsersStore`, tracking them down in a larger project could prove very frustrating.

There are more advanced moves you could pull to mitigate some of these downsides, as specified in [this article](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) by Ben Cherry. (His goal is to create modules, which just happen to be singletons, but the pattern is the same.) But those add unneeded complexity to the code, while still failing to get us exactly what we want.

The New Way(s)
--------------

By leveraging ES6 features, mainly modules and the new `const` variable declaration, we can write singletons in ways that are not only more concise, but which better meet our requirements.

Let’s start with the most basic implementation. Here’s (a cleaner and more powerful) modern interpretation of the above example:

    const _data = [];

    const UserStore = {
      add: item => _data.push(item),
      get: id => _data.find(d => d.id === id)
    }

    Object.freeze(UserStore);
    export default UserStore;


As you can see, this way offers an improvement in readability. But where it really shines is in the constraint imposed upon code that consumes our little singleton module here: the consuming code cannot reassign `UserStore` because of the `const` keyword. And as a result of our use of [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze), its methods cannot be changed, nor can new methods or properties be added to it. Furthermore, because we’re taking advantage of ES6 modules, we know exactly where `UserStore` is used.

Now, here we’ve made `UserStore` an object literal. Most of the time, going with an object literal is the most readable and concise option. However, there are times when you might want to exploit the benefits of going with a traditional class. For example, stores in Flux will all have a lot of the same base functionality. Leveraging traditional object-oriented inheritance is one way to get that repetitive functionality while keeping your code DRY.

Here’s how the implementation would look if we wanted to utilize ES6 classes:

    class UserStore {
      constructor(){
        this._data = [];
      }

      add(item){
        this._data.push(item);
      }

      get(id){
        return this._data.find(d => d.id === id);
      }
    }

    const instance = new UserStore();
    Object.freeze(instance);

    export default instance;


This way is slightly more verbose than using an object literal, and our example is so simple that we don’t really see any benefits from using a class (though it will come in handy in the final example).

One benefit to the class route that might not be obvious is that, if this is your front-end code, and your back end is written in C# or Java, you can employ a lot of the same design patterns in your client-side application as you do on the back end, and increase your team’s efficiency (if you’re small and people are working full-stack). Sounds soft and hard to measure, but I’ve experienced it firsthand working on a C# application with a React front end, and the benefit is real.

It should be noted that, technically, the immutability and non-overridability of the singleton using both of these patterns can be subverted by the motivated provocateur. An object literal can be copied, even if it itself is `const`, by using [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). And when we export an instance of a class, though we aren’t directly exposing the class itself to the consuming code, the constructor of any instance is available in JavaScript and can be invoked to create new instances. Obviously, though, that all takes at least a little bit of effort, and hopefully your fellow devs aren’t so insistent on violating the singleton pattern.

But let’s say you wanted to be extra sure that nobody messed with the singleness of your singleton, and you also wanted it to match the implementation of singletons in the object-oriented world even more closely. Here’s something you could do:

    class UserStore {
      constructor(){
       if(! UserStore.instance){
         this._data = [];
         UserStore.instance = this;
       }

       return UserStore.instance;
      }

     //rest is the same code as preceding example

    }

    const instance = new UserStore();
    Object.freeze(instance);

    export default instance;


By adding the extra step of holding a reference to the instance, we can check whether or not we’ve already instantiated a `UserStore`, and if we have, we won’t create a new one. As you can see, this also makes good use of the fact that we’ve made `UserStore` a class.

Thoughts? Hate Mail?
--------------------

There are no doubt plenty of developers who have been using the old singleton/module pattern in JavaScript for a number of years, and who find it works quite well for them. Nevertheless, because finding better ways to do things is so central to the ethos of being a developer, hopefully we see cleaner and easier-to-reason-about patterns like this one gaining more and more traction. Especially once it becomes easier and more commonplace to utilize ES6+ features.

This is a pattern I’ve employed in production to build the stores in a custom Flux implementation (stores which had a little more going on than our examples here), and it worked well. But if you can see holes in it, please let me know. Also please advocate for whichever of the new patterns you prefer, and whether or not you think object literals are the way to go, or if you prefer classes!

 [![](https://secure.gravatar.com/avatar/59c0103d5cfb0fc6e3dc3e8a7ce5a731?s=96&d=mm&r=g)](https://www.sitepoint.com/author/ssaeed/)

Meet the author

[Samier Saeed](https://www.sitepoint.com/author/ssaeed/)[](https://www.linkedin.com/in/samier-saeed-9335553a)[](https://github.com/ss108)[](https://medium.com/@samiersaeed)

Samier Saeed is a freelance software developer based in Los Angeles. He works in Python, JavaScript, and C#. He is reachable via [his website](http://ss108.github.io/).
