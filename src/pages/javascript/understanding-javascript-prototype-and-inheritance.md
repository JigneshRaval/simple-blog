---
path: "JavaScript/understanding-javascript-prototype-and-inheritance"
date: "2018-10-05"
title: "Understanding JavaScript: Prototype and Inheritance"
tags: ["JavaScript","inheritance","Prototype"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://hackernoon.com/understanding-javascript-prototype-and-inheritance-d55a9a23bde2"
type: "Post"
---

Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of programmers start building applications without having the deep understanding of how something works under the hood. JavaScript is the poster boy of this exact behavior. While it is one of the most complicated languages and most widely spread, many developers are attracted to using higher level tools and abstracting away the “bad parts” of the language.

While you will still be able to do build amazing applications doing that, going into the JavaScript maelstrom can be quite beneficial to you. Understanding the “weird parts” is what separates the average grunt coder from the senior developer and while the JS ecosystem is ever-changing, the fundamentals are those on top of which all other tools are built. Understanding those gives you a broader perception and changes the way you look at the development process.

Inheritance in JavaScript is something that has been discussed for a long time. I started learning JS by taking a bootcamp-y course that was aimed to give us the practical knowledge we’d need in our daily coding challenges. We were told how the bad JavaScript language lacks OO patterns and how we have to break our backs to make them work. The instructors quickly went through _prototype_ and how we can mimic class behavior with it without going in depth with how it’s working (because they didn’t understand it either).

So I was left with this feeling that JS is a crippled language because it lacks the abilities of the other languages to create classes out of the box so we had to do all kinds of crazy shenanigans to make it fit into what we believe was right. Then I started thinking, if it’s so hard to learn, leads to illogical behavior and there are so many roadblocks, maybe _prototypes_ are not the right approach. After reading Kyle Simpson’s book about _prototype_ I made the conclusion that a lot of people blame JavaScript for their own inability to learn new concepts. JS has it’s specifics and I’ll go through how prototypical inheritance works and what are it’s problems.

### What’s Prototype?

Almost all objects in JavaScript have the _prototype_ property. By using it and more specifically the _prototype chain_ we can _mimic_ inheritance. The prototype is a reference to another object and it is used whenever JS can’t find the property you’re looking for on the current object. Simply put, whenever you call a property on an object and it doesn’t exist, JavaScript will go to the prototype object and look for it there. If it finds it it will use it, if not it will go to that object’s property and look there. This can bubble up all the way to Object.prototype before returning _undefined._ This is the essence of the prototype chain and the behavior that sits behind JavaScript’s inheritance.

![](https://i.embed.ly/1/display/resize?url=https%3A%2F%2Favatars3.githubusercontent.com%2Fu%2F7038691%3Fv%3D3%26s%3D400&key=4fce0568f2ce49e8b54624ef71a8a5bd&width=40)

The above code can be overwhelming when you first encounter prototypes, let’s break it down. We’ll start from line 20 — with the _new_ keyword we create a new object using the Dog constructor function on line 9. That gives us an object with a name property and a makeSound function bound to it’s prototype. When we call makeSound it is executed in the context of the current object (dog) and we get the correct output.

When we call sleep() it obviously doesn’t exist on Dog, so it goes up the prototype chain to Animal. It finds it there and calls it. On the last line we call the missing() function which is not defined anywhere. It will go all the way up the prototype chain to Object.prototype and since it won’t find it there it will throw an error.

As you see we haven’t used the word class anywhere, we haven’t defined a class that extends the base one or something like that. This is more of a delegation than inheritance. Every object has this prototype property which points to another object which should be delegated responsibility in case the property we’re looking for is not found on the current one. There’s nothing fancy about that, the object is just delegating responsibilities to it’s superior whenever it can’t handle the task.

### Shadowing

If we look through the prism of inheritance once again we know that we often need to override properties and methods. In prototypical inheritance this is called **shadowing**.

![](https://i.embed.ly/1/display/resize?url=https%3A%2F%2Favatars3.githubusercontent.com%2Fu%2F7038691%3Fv%3D3%26s%3D400&key=4fce0568f2ce49e8b54624ef71a8a5bd&width=40)

What we’re doing here is creating a property with the same name on Dog’s prototype, so when we call it it will find it there and stop the prototype chain bubbling. As you can see, we’re not using the override keyword anywhere, we’re just declaring the property on the Dog object so JavaScript won’t start looking for it in the prototype chain.

### **Problems with Inheritance**

If you’ve read my previous articles with the same label, here is the point in which I tell you that JavaScript always has it’s specifics and not understanding them correctly can give you a big headache. At some point you may have to use _shadowing_ on a property, but then inside of it call the “parent” function with the same name. While in most other languages you can just use _super()_, here things are a bit trickier. If you use this approach and call _this.sleep()_ inside of the shadowed function, you will end up calling the same function and the result will be a recursion. Therefore we must think of another way to solve the problem.

Dog.prototype.sleep = function() {         
  Animal.prototype.sleep();  
}

This sounds like a good approach at first and it almost is, but if you execute it you will see that you will not get the result you expect because the contextual binding is not correct.

Dog.prototype.sleep = function() {  
  Animal.prototype.sleep.call(this);  
}

By executing it like this however we call the function on Animal using the contextual binding of the current function. In other words we call Animal’s sleep function using the current Dog’s data, I can’t explain it much simpler than that.

### The concept of Inheritance

For me, one of the hardest things to wrap my head around was the prototype keyword meaning. I was trying to make some mental connection between the word and the process of inheritance until I realized that they really have no connection. What we’re doing is just abusing the prototype behavior delegation in order to mimic inheritance while in fact we don’t have it. In order to give you another example of how our conception of class based hierarchies is different than JS prototypes — I present you the **_constructor_** property.

This is a property on Object.prototype and it returns the constructor function that created the object that we’re calling this on. Not the name of the function but the function itself. What do you think would happen if we log into the console the constructor property of the _dog_ variable? You probably expect it to return the Dog function, but you will be surprised.

console.log(dog.constructor); // \[Function: Animal\]

Wait what? This is returning the Animal function because it is attached to the Dog property upon object creation. This once again shows that those methods and properties weren’t implemented with OO design in mind.

### ES6 Classes

As of ES6 you can say that the inheritance hierarchy problems in JavaScript is solved. We got the _class_ keyword together with all other goodies that come with it. We can now define classes, extend them, use constructors and the _super_ keyword to access parent methods without the ugliness of the code above.

![](https://i.embed.ly/1/display/resize?url=https%3A%2F%2Favatars3.githubusercontent.com%2Fu%2F7038691%3Fv%3D3%26s%3D400&key=4fce0568f2ce49e8b54624ef71a8a5bd&width=40)

This looks a lot better if you’re already familiar with classes. It removed the unnecessary repetition of the prototype keyword, the use of Object.create() and the dark magic that we had to do in order to call a “parent” function. You also have the proper syntax and it’s much easier to understand what is going on. The ES6 code and the prototype code above are more or less doing the exact same thing, but the one of the new standard is times easier to understand.

Now something that you need to bear in mind is that this syntax is (mostly) just a beautified version of the prototype. It really simplifies the development process by making things easier for people with background in other languages to understand. But something that needs to be considered is that because of that same reason — ES6 classes being syntactic sugar over prototype — there are still some issues.

Because the prototype approach is more like delegation rather than real inheritance, “parent” objects are passed as a reference. In other languages, upon creating an object, you get a copy of it’s functionality, including the parent classes. Therefore in JS, a child object can access “parent” functions even if they are created after the child object. This is due to the fact that prototype is just a reference, not a concrete object. It’s a hotline that objects use to find a way out when they are missing a particular property.

### Conclusion

Until the introduction of “real” classes in ES6, the whole concept of inheritance was messed up and (usually) taught in a wrong manner. Prototypes are more of a delegation tool and they don’t really behave like classes. Now with the modern approach we can pretty much create normal class hierarchies and use understandable syntax for them, but be wary of possible problems that may occur. This syntax is only a beautiful facade for what’s going on inside.

If you’re interested in more JS related content you can subscribe to my newsletter from [**_here_**](https://buttondown.email/kondov) or you can take a look at the other articles from the same series:

[**Understanding JavaScript: Scope**  
_Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of…_hackernoon.com](https://hackernoon.com/understanding-javascript-scope-1d4a74adcdf5 "https://hackernoon.com/understanding-javascript-scope-1d4a74adcdf5")[](https://hackernoon.com/understanding-javascript-scope-1d4a74adcdf5)

[**Understanding JavaScript: Prototype and Inheritance**  
_Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of…_hackernoon.com](https://hackernoon.com/understanding-javascript-prototype-and-inheritance-d55a9a23bde2 "https://hackernoon.com/understanding-javascript-prototype-and-inheritance-d55a9a23bde2")[](https://hackernoon.com/understanding-javascript-prototype-and-inheritance-d55a9a23bde2)

[**Understanding JavaScript: This Keyword**  
_Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of…_hackernoon.com](https://hackernoon.com/understanding-javascript-the-this-keyword-4de325d77f68 "https://hackernoon.com/understanding-javascript-the-this-keyword-4de325d77f68")[](https://hackernoon.com/understanding-javascript-the-this-keyword-4de325d77f68)

[**Understanding JavaScript: New Keyword**  
_Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of…_hackernoon.com](https://hackernoon.com/understanding-javascript-new-keyword-ec67c8caaa74 "https://hackernoon.com/understanding-javascript-new-keyword-ec67c8caaa74")[](https://hackernoon.com/understanding-javascript-new-keyword-ec67c8caaa74)

[**Understanding JS: Coercion**  
_Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of…_hackernoon.com](https://hackernoon.com/understanding-js-coercion-ff5684475bfc "https://hackernoon.com/understanding-js-coercion-ff5684475bfc")[](https://hackernoon.com/understanding-js-coercion-ff5684475bfc)

[**Understanding JS: The Event Loop**  
_Due to the amazing quantity of libraries, tools and all kinds of things that make your development easier, a lot of…_hackernoon.com](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40 "https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40")[](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40)

[

![](https://cdn-images-1.medium.com/freeze/max/30/1*QCV7h713dLgy5COZTyBLdQ@2x.png?q=20)

![](https://cdn-images-1.medium.com/max/800/1*QCV7h713dLgy5COZTyBLdQ@2x.png)

![](https://cdn-images-1.medium.com/max/800/1*QCV7h713dLgy5COZTyBLdQ@2x.png)



](https://bit.ly/2O1yNyY)