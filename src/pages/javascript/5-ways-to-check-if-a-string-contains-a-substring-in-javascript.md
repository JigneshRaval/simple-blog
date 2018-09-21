---
path: "JavaScript/5-ways-to-check-if-a-string-contains-a-substring-in-javascript"
date: "2018-09-20"
title: "5 ways to check if a string contains a substring in JavaScript"
tags: ["JavaScript"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app."
coverImage: ""
sourceUrl: "https://medium.com/@jbuty/5-ways-to-check-if-a-string-contains-a-substring-in-javascript-523ac134f878"
type: "Post"
---

#### **1\. ES6 **`**.includes()**`**:**

var S = "fullweb";
S.includes("web");

#### **2\. RegExp **`**.search()**`**:**

var S = "fullweb";
S.search(/web/);

#### **3\. RegExp **`**.match()**`**:**

var S = "fullweb";
S.match(/web/);

#### **4\. RegExp **`**.test()**`**:**

var S = "fullweb";
S.test(/web/);

#### **5\. Good old’ **`**.indexOf()**`**:**

var S = "fullweb";
S.indexOf("web");

I’ve tested them for speed in Chrome on a MacBook Pro, and it appears ES6 `.includes()` is the fastest, and `.match()` is the slowest, with all the others almost as fast as ES6 `.includes()`.
