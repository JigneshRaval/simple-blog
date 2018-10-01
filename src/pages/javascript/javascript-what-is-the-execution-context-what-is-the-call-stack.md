---
path: "JavaScript/javascript-what-is-the-execution-context-what-is-the-call-stack"
date: "2018-09-27"
title: "Javascript: What Is The Execution Context? What Is The Call Stack?"
tags: ["JavaScript"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://www.valentinog.com/blog/js-execution-context-call-stack/"
type: "Post"
---

What is the **Execution Context in Javascript**?

![Javascript: What Is The Execution Context? What Is The Call Stack?](https://www.valentinog.com/blog/wp-content/uploads/2018/05/javascript-what-is-execution-context-call-stack-ft.png)

I bet you don't know the answer.

What are the most basic components of a programming language?

Variables and functions right? Everybody can learn these building blocks.

But what lies beyond the basics?

What are the **pillars of Javascript** that you should master before calling yourself intermediate (or even senior) Javascript developer?

There are many: Scope, Closure, Callbacks, Prototype, and so on.

But before diving deeper into these concepts you should at least understand **how the Javascript engine works**.

In this post we'll walk through two fundamental pieces of every Javascript engine: **the Execution Context and the Call Stack.**

(Don't be scared. It's easier than you think).

Ready?

This material is part of my [Advanced Javascript class available both as remote 1 to 1 training](https://www.valentinog.com/) or as [on site training in Europe](https://www.servermanaged.it/formazione-javascript-react.html).

Table of Contents

*   [Javascript: What Is The Execution Context? What You Will Learn](#Javascript_What_Is_The_Execution_Context_What_You_Will_Learn "Javascript: What Is The Execution Context? What You Will Learn")
*   [Javascript: What Is The Execution Context? How Does Javascript Run Your Code?](#Javascript_What_Is_The_Execution_Context_How_Does_Javascript_Run_Your_Code "Javascript: What Is The Execution Context? How Does Javascript Run Your Code?")
*   [Javascript: What Is The Execution Context? Javascript Engines](#Javascript_What_Is_The_Execution_Context_Javascript_Engines "Javascript: What Is The Execution Context? Javascript Engines")
*   [Javascript: What Is The Execution Context? How It Works?](#Javascript_What_Is_The_Execution_Context_How_It_Works "Javascript: What Is The Execution Context? How It Works?")
*   [Javascript: What Is The Execution Context? The Global Memory](#Javascript_What_Is_The_Execution_Context_The_Global_Memory "Javascript: What Is The Execution Context? The Global Memory")
*   [Javascript: What Is The Execution Context? What Is The Call Stack?](#Javascript_What_Is_The_Execution_Context_What_Is_The_Call_Stack "Javascript: What Is The Execution Context? What Is The Call Stack?")
*   [Javascript: What Is The Execution Context? The Local Execution Context](#Javascript_What_Is_The_Execution_Context_The_Local_Execution_Context "Javascript: What Is The Execution Context? The Local Execution Context")
*   [Javascript: What Is The Execution Context? What is the Call Stack? Wrapping up](#Javascript_What_Is_The_Execution_Context_What_is_the_Call_Stack_Wrapping_up "Javascript: What Is The Execution Context? What is the Call Stack? Wrapping up")

Javascript: What Is The Execution Context? What You Will Learn
--------------------------------------------------------------

In this post you'll learn:

*   how the Javascript Engine works
*   the Execution Context in Javascript
*   what is the Call Stack
*   the difference between Global Execution Context and Local Execution Context

Javascript: What Is The Execution Context? How Does Javascript Run Your Code?
-----------------------------------------------------------------------------

How does Javascript run your code?

If you're a senior developer you may already know the answer.

If you're a beginner we'll work through together.

The truth is, Javascript internals aren't easy.

But I guarantee you can learn them.

And by the time you learn them you'll feel empowered and smarter.

By looking at Javascript inner functioning you'll become a better Javascript developer, even if you can't master every single detail.

Now, take a look at the following code:

var num = 2;

function pow(num) {
    return num \* num;
}

1.  var num \=  2;

3.  function pow(num)  {
4.  return num \* num;
5.  }

var num = 2;

function pow(num) {
    return num \* num;
}

Done?

It doesn't look hard!

Now tell me: **in what order you think the browser will evaluate that code**?

In other words, if YOU were the browser, how would you read that code?

It sounds like an easy one.

Most people think “yeah, the browser executes function pow and returns the result, then it assign 2 to num.”

Do you want to know my student's answer?

_Top to bottom_

_The browser will start at function pow, calculating num \* num_

_JS engine will run the code line by line_ (kind of)

I was expecting that.

I said the same exact things  years ago.

In the next sections you'll discover the machinery behind those **apparently simple lines of code**.

Javascript: What Is The Execution Context? Javascript Engines
-------------------------------------------------------------

Do you want to be an average Javascript developer?

I bet you won't.

If you want to make a good impression in a Javascript interview you should at least know **how Javascript runs your code**.

(And a bunch of other stuff which I won't cover here).

Don't rush on these concepts.

You can't learn everything in a day. It will take time.

The good news? I'm going to make that stuff understandable for everyone (at least I'll try).

To understand how Javascript runs your code we should meet the first scary thing:

mister **Execution Context**.

What is the Execution Context in Javascript?

**Every time you run Javascript** in a browser (or in Node) **the engine goes through a series of steps**.

One of this steps involves **the creation of the Global Execution Context**.

Wait Valentino, **what is the engine**?

That is, the Javascript engine is the “engine” that runs Javascript code.

Nowadays there are two prominent Javascript engines: [**Google V8**](https://developers.google.com/v8/) and [**SpiderMonkey**](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey).

V8 is the Google's open source JavaScript engine, used in Google Chrome and Node.js.

SpiderMonkey is the Mozilla's JavaScript engine, used in Firefox.

So far we have the **Javascript engine and an Execution Context**.

Now it's time to understand how they work together.

Javascript: What Is The Execution Context? How It Works?
--------------------------------------------------------

**The engine creates a Global Execution Context** every time you run some Javascript code.

Execution Context is a fancy word for describing the environment in which your Javascript code runs.

It's hard to visualize these abstract things, I feel you.

For now think of the Global Execution Context as a box:

![Javascript: What Is The Execution Context?](https://www.valentinog.com/blog/wp-content/uploads/2018/05/javascript-what-is-global-execution-context-1.png)

Let's look again at our code:

var num = 2;

function pow(num) {
    return num \* num;
}

1.  var num \=  2;

3.  function pow(num)  {
4.  return num \* num;
5.  }

var num = 2;

function pow(num) {
    return num \* num;
}

How does the engine read that code?

Here is a simplified version:

**Engine**: _Line one. There's a variable! Cool. Let's store it in the Global Memory._

**Engine**: _Line three. I see a function declaration. Cool. Let's store that in the Global Memory too!_

**Engine**: _Looks like I'm done._

If I were to ask you again: how does the browser “see” the following code, what would you say?

Yeah, it's kind of top to bottom but …

As you can see the engine does not run the function pow!

It's a **function declaration**, not a function call.

The above code will translate in some values stored in the **Global Memory**: a function declaration and a variable.

**Global Memory**?

Valentino, I'm already confused by the Execution Context and now you're throwing the Global Memory at me?

Yes I am.

Let's see what the Global Memory is.

Javascript: What Is The Execution Context? The Global Memory
------------------------------------------------------------

The **Javascript engine has a Global Memory too**.

The Global Memory contains global variables and function declarations for later use.

If you read “**Scope and Closures**” by Kyle Simpson you may find that the Global Memory overlaps with the concept of Global Scope.

In fact they are the same thing.

I'm flying 10,000 feet high here, for a good reason.

Those are hard concepts.

But you shouldn't worry for now.

I want you to understand two important pieces of our puzzle.

When the Javascript engine runs your code it creates:

*   a Global Execution context
*   a Global Memory (also called Global Scope or Global Variable Environment)

Is everything clear?

If I were you at this point I'll:

*   write down some Javascript code
*   parse the code step by step as you were the engine
*   make a graphic representation of both the Global Execution context and the Global Memory during the execution

You can write the exercise on paper or with a prototyping tool.

For my tiny example the picture will look like so:

![A graphic representation of Javascript Execution Context / Global Memory](https://www.valentinog.com/blog/wp-content/uploads/2018/05/javascript-global-execution-context-global-memory.png)

In the next section we'll look at another scary thing: the **Call Stack**.

Javascript: What Is The Execution Context? What Is The Call Stack?
------------------------------------------------------------------

Do you have a clear picture of **how** the **Execution Context**, the **Global Memory** and the **Javascript engine fits together**?

If not take your time to review the previous section.

We're going to introduce another piece in our puzzle: the **Call Stack**.

Let's first recap what happens when the Javascript engine runs your code.

It creates:

*    a Global Execution context
*   a Global Memory

Besides that in our example nothing more happened:

var num = 2;

function pow(num) {
    return num \* num;
}

1.  var num \=  2;

3.  function pow(num)  {
4.  return num \* num;
5.  }

var num = 2;

function pow(num) {
    return num \* num;
}

The code is a pure allocation of values.

Let's take a step further.

What happens if I call the function?

var num = 2;

function pow(num) {
    return num \* num;
}

var res = pow(num);

1.  var num \=  2;

3.  function pow(num)  {
4.  return num \* num;
5.  }

7.  var res \= pow(num);

var num = 2;

function pow(num) {
    return num \* num;
}

var res = pow(num);

Interesting question.

The act of **calling a function in Javascript makes the engine ask for help**.

And that help comes from a friend of the Javascript engine: the **Call Stack**.

It might not sound obvious but **the Javascript engine needs to keep track of what's happening**.

It relies on the Call Stack for that.

What is the Call Stack in Javascript?

The **Call Stack is like a log of the current execution of the program**.

In reality it's a data structure: a [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)).

How does exactly the Call Stack work?

Unsurprisingly it has two methods: **push** and **pop**.

**Pushing** is the act of **putting something into the stack**.

That is, **when you run a function in Javascript the engine pushes that function into the Call Stack**.

Every function call gets pushed into the Call Stack.

The **first thing that gets pushed is main()** (or global()), the main thread of execution of your Javascript program.

Now, the previous picture will look like so:

![Javascript Call Stack](https://www.valentinog.com/blog/wp-content/uploads/2018/05/javascript-call-stack.png)

**Popping** on the other end **is the act of removing something from the stack**.

When a function ends executing it gets popped from the Call Stack.

And our Call Stack will look like the following:

![Javascript Call Stack pop](https://www.valentinog.com/blog/wp-content/uploads/2018/05/javascript-call-stack-pop-715x1024.png)

And now? You're ready to master every Javascript concept from there.

I'm not kidding.

But where not done! Go to the next section!

Javascript: What Is The Execution Context? The Local Execution Context
----------------------------------------------------------------------

Everything seems clear so far.

Are we missing something?

We know that the **Javascript engine creates a Global Execution context and a Global Memory**.

Then, when you call a function in your code:

*   the Javascript engine asks for help
*   that help comes from a friend of the Javascript engine: the **Call Stack**
*   the **Call Stack keep tracks of what function is being called** in your code

Yet **another thing has to happen when you run a function** in Javascript.

First, **the function appears in the Global Execution context**.

Then, **another mini-context appears alongside the function**:

that little new box is called **Local Execution Context**.

What??

If you noticed, in the previous picture a new variable appears in the Global memory: **var _res_**.

The variables _**res**_ has a value of **undefined** at first.

Then as soon as **pow** appears in the **Global Execution Context**, **the function executes and _res_ takes its return value**.

During the execution phase a Local Execution Context gets created for holding up local variables.

What a powerful concept.

![During the execution phase a Local Execution Context gets created, alongside a Local Memory for holding up local variables.](https://www.valentinog.com/blog/wp-content/uploads/2018/05/javascript-local-execution-context.png)

Keep that in mind.

Understanding both the **Global and the Local Execution Context is the key for mastering [Scope and Closures](https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures)**.

Javascript: What Is The Execution Context? What is the Call Stack? Wrapping up
------------------------------------------------------------------------------

Can you believe what's behind 4 lines of code?

The **Javascript engine** creates an **Execution Context**, a **Global Memory**, and a **Call Stack**.

But once you call a function the engine creates a **Local Execution Context which has a Local Memory**.

By the end of this post you should be able to understand what happens when you run some Javascript code.

Often overlooked, Javascript internals are always seen as misterious things by new developers.

Yet they are the **key for mastering advanced Javascript concepts**.

If you learn Execution Context, Global Memory, and the Call Stack, **then Scope, Closures, Callbacks and other stuff will be easy as a breeze**.

In particular, understanding the Call Stack is paramount.

All the Javascript will start to make sense once you visualize it: you will finally understand **why Javascript is asynchronous** and why we do need Callbacks.

Did you know **what's behind 4 lines of Javascript code**?

Now you know it.

Thanks for reading!

_This material is part of my [Advanced Javascript class available both as remote 1 to 1 training](https://www.valentinog.com/) or as [on site training in Europe](https://www.servermanaged.it/formazione-javascript-react.html)._

*   [About](#abh_about)
*   [Latest Posts](#abh_posts)

[![Valentino Gagliardi](https://www.valentinog.com/blog/wp-content/uploads/gravatar/valentino-gagliardi-web-developer.jpg)](http://www.valentinog.com "Valentino Gagliardi")

### [Valentino Gagliardi](http://www.valentinog.com)

I help busy people to learn Web Development and JavaScript!

[![Valentino Gagliardi](https://www.valentinog.com/blog/wp-content/uploads/gravatar/valentino-gagliardi-web-developer.jpg)](http://www.valentinog.com "Valentino Gagliardi")

#### Latest posts by Valentino Gagliardi ([see all](https://www.valentinog.com/blog/author/valentino-g/))

*   [Javascript: What Is The Execution Context? What Is The Call Stack?](https://www.valentinog.com/blog/js-execution-context-call-stack/) - 23rd May 2018
*   [How To Use Async Await in React (componentDidMount Async)](https://www.valentinog.com/blog/how-async-await-in-react/) - 27th April 2018
*   [How to Throw Errors From Async Functions in Javascript? (and how to test them)](https://www.valentinog.com/blog/throw-errors-async-functions-javascript/) - 12th April 2018
