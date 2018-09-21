---
path: "getting-unique-values-in-javascript-arrays"
date: "2018-05-21"
title: "Getting unique values in JavaScript arrays"
tags: ["JavaScript", "Array"]
category: "JavaScript"
categoryColor: '#F3C610'
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app."
coverImage: '/assets/images/Image00001.jpg'
sourceUrl: 'https://medium.com/front-end-hacking/getting-unique-values-in-javascript-arrays-17063080f836'
type: 'Snippet'
---

## Method 1: ES5 Syntax

    const unique = (value, index, self) => {
        return self.indexOf(value) === index;
    }
    const sampleValues = [1, 4, 5, 2, 'a', 'e', 'b', 'e', 2, 2, 4];
    const uniqueValues = sampleValues.filter(unique);

## Method 2: The cooler ES6 way!

ES6 introduced two new data structures: Map and set. We’ll use Set for our task here.

A set is a collection of values which can be iterated upon in the order of insertion. A value in the set may only occur once; it is unique in the set’s collection.

    const sampleValues = [1, 4, 5, 2, 'a', 'e', 'b', 'e', 2, 2, 4];
    const uniqueValues = [...new Set(sampleValues)];
    console.log(uniqueValues); //[1, 4, 5, 2, "a", "e", "b"]
