---
title: "Going From ES5 to ES6"
date: "2018-09-14"
path: "ES6/going-from-es5-to-es6"
tags: ["ES6", "ES5", "JavaScript"]
category: "ES6"
categoryColor: '#F3C610'
excerpt: "No doubt that the ES6 version of JavaScript came with tons of amazing and useful features making web development with JavaScript even simpler and less error-prone."
coverImage: '/assets/images/Image00001.jpg'
sourceUrl: 'https://scotch.io/tutorials/going-from-es5-to-es6-solution-to-code-challenge-13314'
type: 'Post'
---

Last week on the code challenge #13 we looked at converting sample code in ES5 to even simpler and more readable code in ES6\. Yet to take the challenge? You can [check it out here](https://scotch.io/bar-talk/code-challenge-13-going-from-es5-to-es6).

In this post, we shall solve the challenge.

Awesome entries for the challenge can be found in the comment section of the post, on Twitter using the hashtag #ScotchChallenge and on the Spectrum forum.

## [The Challenge](#toc-the-challenge)

No doubt that the ES6 version of JavaScript came with tons of amazing and useful features making web development with JavaScript even simpler and less error-prone.

<div class="is-hidden-with-subscription has-text-centered" align="center" id="Scotch.io_InContent_1"><script data-cfasync="false" type="text/javascript">freestar.queue.push(function () { googletag.display('Scotch.io_InContent_1'); });</script></div>

In this challenge, we are presented with a set of 5 different code pieces requiring a re-write using a key ES6 feature. We would go over these individual challenges and the solution for each shortly. However, we were provided with boilerplate code written in ES5, we shall go over that briefly.

## [The Base](#toc-the-base)

While no HTML and CSS is provided for this challenge, JavaScript is required and outputs from the script are logged to console. Each challenge is written in ES5 with a mix of ES5 and ES6 variable definitions.

Check out the codepen here: [https://codepen.io/Chuloo/pen/xadjjO](https://codepen.io/Chuloo/pen/xadjjO)

Looking at the script in the pen above, we can see the individual ES6 syntax requirements requested.

## [The Technique](#toc-the-technique)

Going over each challenge we have:

### Arrow Functions

Arrow functions provide a simpler and better way to write functions, re-writing the first challenge we have:

    // The Challenge
    const golden = function goldenFunction(){
      alert("this is golden!!")
    }

    // The Solution
    const golden = ()=>{
      alert("this is golden")
    }

    golden()

### Enhanced Object Literals

Referencing and assigning function arguments in its definitons got easier with enhanced object literals. Re-writing our script we have:

    // The Challenge
    const newFunction = function literal(firstName, lastName){
      return {
        firstName: firstName,
        lastName: lastName,
        fullName: function(){
          alert(firstName + " " + lastName)
          return
        }
      }
    }

    // The Solution
    const newFunction = (firstName, lastName)=>{
      return{
        firstName,
        lastName,
        fullName(){
          alert(firstName + " " + lastName)
          return
        }
      }
    }
    newFunction("William", "Imoh").fullName()

Using enhanced object literals, we no longer need to define the key and property of a returned object if its values are picked from the function's arguments. Also, it presents a cleaner way of writing methods.

### Object Destructuring

Previously accessing the value of an object's key would require using the dot or bracket notation. Now imagine having to write a line of code each time to assign an object's property value to a new variable. Object destructuring solves this in one line. Re-writing our base challenge we have:

    // The Challenge
    const newObject = {
      firstName: "Harry",
      lastName: "Potter Holt",
      destination: "Hogwarts React Conf",
      occupation: "Deve-wizard Avocado",
      spell: "Vimulus Renderus!!!"
    }
    const firstName = newObject.firstName;
    const lastName = newObject.lastName;
    const destination = newObject.destination;
    const occupation = newObject.occupation;

    console.log(firstName, lastName, destination, occupation)

    // The Solution
    const newObject = {
      firstName: "Harry",
      lastName: "Potter Holt",
      destination: "Hogwarts React Conf",
      occupation: "Deve-wizard Avocado",
      spell: "Vimulus Renderus!!!"
    }

    const {firstName, lastName, destination, occupation, spell} = newObject
    console.log(firstName, lastName, destination, occupation)

This largely reduced the number of lines written from 13 to 5\. Note that in destructuring, new variables are created whose names are the same as the source object's keys and the value corresponds to their individual source values.

### Array Spread

The spread operator in JavaScript provides the ability to 'unpack' any iterable data into places were arguments or elements are expected i.e arrays. This enables is to unpack each individual array we have into a new array. Re-writing our snippet we have:

    // The Challenge
    const west = ["Will", "Chris", "Sam", "Holly"]

    const east = ["Gill", "Brian", "Noel", "Maggie"]

    const combined = west.concat(east)

    console.log(combined)

    // The Solution
    const west = ["Will", "Chris", "Sam", "Holly"]

    const east = ["Gill", "Brian", "Noel", "Maggie"]

    const combined = [...west,...east]

    console.log(combined)

The spread operator is the 3 dots before the variable name.

### Template Literals

Whilst it may seem like a piece of cake to join up string characters using the plus `+` sign or using multi-line string characters to create multi-line strings, template literals afford us the ability to seamlessly input variables in string expressions as well as create multi-line string expressions. Here's a re-write of our challenge post:

    // The Challenge
    const planet = "earth"
    const view = "glass"
    var before = 'Lorem ' + view + 'dolor sit amet, ' +     'consectetur adipiscing elit,' + planet + 'do eiusmod tempor ' +
        'incididunt ut labore et dolore magna aliqua. Ut enim' +
        ' ad minim veniam'

    // The Solution
    const planet = "earth"
    const view = "glass"
    let before = `Lorem ${view} dolor sit amet,
    consectetur adipiscing elit, ${planet} do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam`

    console.log(before)

This returns a multi-line string value with interpolated variables.

Running each script would provide the same result as the base codepen.

Here's the pen with all the challenges: [https://codepen.io/Chuloo/pen/QVmpoy](https://codepen.io/Chuloo/pen/QVmpoy)

## [Conclusion](#toc-conclusion)

Going through this challenge we have looked through basic and important features of ES6\. While some tools and technologies accept older JavaScript syntax, writing in ES6 affords you a better, clearer, simpler and less buggy approach to coding in JavaScript. Feel free to leave your comments and suggestions in the comment section of this post and watch out for the next challenge. **Happy coding**!
