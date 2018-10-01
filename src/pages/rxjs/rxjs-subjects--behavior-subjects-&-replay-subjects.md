---
path: "RxJs/rxjs-subjects--behavior-subjects-&-replay-subjects"
date: "2018-09-28"
title: "RxJS: Subjects, Behavior Subjects & Replay Subjects"
tags: ["RxJs"]
category: "RxJs"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://alligator.io/rxjs/subjects/"
type: "Post"
---

A subject in Rx is a special hybrid that can act as both an observable and an observer at the same time. This way, data can be pushed into a subject and the subject's subscribers will in turn receive that pushed data.

Subjects are useful for multicasting or for when a source of data is not easily transformed into an observable. It's easy to overuse **subjects** and oftentimes, as illustrated in [this excellent post](https://medium.com/@benlesh/on-the-subject-of-subjects-in-rxjs-2b08b7198b93), subjects can be avoided when an observable source can be created otherwise.

On top of vanilla subjects, there are also a few specialized types of subjects like _async subjects_, _behavior subjects_ and _replay subjects_. In this post, we'll introduce **subjects**, **behavior subjects** and **replay subjects**.

[](#using-subjects)Using Subjects
---------------------------------

Creating a subject is as simple as newing a new instance of RxJS's _Subject_:

```
const mySubject = new Rx.Subject();
```

Multiple subscriptions can be created and internally the subject will keep a list of subscriptions:

```
const mySub = mySubject.subscribe(x => console.log(`${x} ${x}`));
const mySub2 = mySubject.subscribe(x => console.log(x.toUpperCase()));
```

Data can be pushed into the subject using its _next_ method:

```
mySubject.next('👋 Hello!');

// 👋 Hello! 👋 Hello!
// 👋 HELLO!
```

When data is pushed into a subject, it'll go through its internal list of subscriptions and next the data into each one.

### Simple example

Here's an example that demonstrates how data gets is pushed to the subscriptions:

```
const mySubject = new Rx.Subject();

mySubject.next(1);

const subscription1 = mySubject.subscribe(x => {
  console.log('From subscription 1:', x);
});

mySubject.next(2);

const subscription2 = mySubject.subscribe(x => {
  console.log('From subscription 2:', x);
});

mySubject.next(3);

subscription1.unsubscribe();

mySubject.next(4);
```

With this example, here's the result that'll be printed in the console:

```
From subscription 1: 2
From subscription 1: 3
From subscription 2: 3
From subscription 2: 4
```

Note how subscriptions that arrive late are missing out on some of the data that's been pushed into the subject. We'll see how to manage that below with _Behavior Subjects_ or _Replay Subjects_.

### Error and Completion

When a subject completes or errors out, all the internal subscriptions also complete or error out:

```
const mySubject = new Rx.Subject();

const sub1 = mySubject.subscribe(null, err =>
  console.log('From sub1:', err.message)
);

const sub2 = mySubject.subscribe(null, err =>
  console.log('From sub2:', err.message)
);

mySubject.error(new Error('Oh nooo!'));

// From sub1: Oh nooo!
// From sub2: Oh nooo!
```

### Multicasting

The real power of subjects comes into play with _multicasting_, where a subject is passed as the observer to an observable, which will mean that, when the observable emits, the data is **multicasted** to all of the subject's subscriptions:

Here's an example where a _trickleWords_ observable emits a word every 750ms.

```
const mySubject = new Rx.Subject();
const words = ['Hot Dog', 'Pizza', 'Hamburger'];

const trickleWords = Rx.Observable.zip(
  Rx.Observable.from(words),
  Rx.Observable.interval(750),
  word => word
);

const subscription1 = mySubject.subscribe(x => {
  console.log(x.toUpperCase());
});

const subscription2 = mySubject.subscribe(x => {
  console.log(
    x
      .toLowerCase()
      .split('')
      .reverse()
      .join('')
  );
});

trickleWords.subscribe(mySubject);
```

Here's the printed result after all the values have been emitted:

```
HOT DOG
god toh
PIZZA
azzip
HAMBURGER
regrubmah
```

### asObservable

The _asObservable_ operator can be used to transform a subject into an observable. This can be useful when you'd like to expose the data from the subject, but at the same time prevent having data inadvertently pushed into the subject:

```
const mySubject = new Rx.Subject();
const myObs = mySubject.asObservable();

mySubject.next('Hello');
myObs.next('World!'); // TypeError: myObs.next is not a function

```

[](#replay-subjects)Replay Subjects
-----------------------------------

As you saw previously, late subject subscriptions will miss out on the data that was emitted previously. Replay subjects can help with that by keeping a buffer of previous values that will be emitted to new subscriptions.

Here's a usage example for replay subjects where a buffer of 2 previous values are kept and emitted on new subscriptions:

```
const mySubject = new Rx.ReplaySubject(2);

mySubject.next(1);
mySubject.next(2);
mySubject.next(3);
mySubject.next(4);

mySubject.subscribe(x => {
  console.log('From 1st sub:', x);
});

mySubject.next(5);

mySubject.subscribe(x => {
  console.log('From 2nd sub:', x);
});
```

Here's what that gives us at the console:

```
From 1st sub: 3
From 1st sub: 4
From 1st sub: 5
From 2nd sub: 4
From 2nd sub: 5
```

[](#behavior-subjects)Behavior Subjects
---------------------------------------

Behavior subjects are similar to replay subjects, but will re-emit only the last emitted value, or a default value if no value has been previously emitted:

```
const mySubject = new Rx.BehaviorSubject('Hey now!');

mySubject.subscribe(x => {
  console.log('From 1st sub:', x);
});

mySubject.next(5);

mySubject.subscribe(x => {
  console.log('From 2nd sub:', x);
});
```

And the result:

```
From 1st sub: Hey now!
From 1st sub: 5
From 2nd sub: 5
```
