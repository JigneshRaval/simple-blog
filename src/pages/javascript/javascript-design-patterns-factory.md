---
path: "JavaScript/javascript-design-patterns-factory"
date: "2018-10-01"
title: "JavaScript Design Patterns: Factory"
tags: ["JavaScript","Pattern"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://www.joezimjs.com/javascript/javascript-design-patterns-factory/"
type: "Post"
---

Another post, another JavaScript design pattern. Today we feature the Factory pattern. The Factory pattern is one of my favorite patterns, especially the “simple factory”, which I’ll explain later. Factories – in real life as well as within the programming world – create objects. It helps clean up your code by removing all of the `new` operators.

As usual, at the [bottom of this post](#series) is a list of all the posts in this JavaScript Design Patterns series. I think it may be worth spending some time reading those too.

[](#Simple-Factory "Simple Factory")Simple Factory
--------------------------------------------------

There are two types of factories: the Simple Factory and the normal Factory. We’ll start out with the Simple Factory because it’s… well… simpler. Today, instead of simply conjuring up an example, we’ll actually use our example from the [Decorator pattern post](/javascript/javascript-design-patterns-decorator/ "JavaScript Design Patterns: Decorator") and fix it up to make it purely awesome. If you don’t understand the Decorator pattern, then you really should [go back and read about it](/javascript/javascript-design-patterns-decorator/ "JavaScript Design Patterns: Decorator") before continuing on if you want this to make any sense.

So, what is the Factory pattern going to do to make the Decorator example better? If you remember the end implementation code, if you wanted a vehicle with all three of the features that were currently coded, you needed to create 4 objects, all with the `new` operator. This is tiresome and tedious, so we’re going to use a single function call to create a car with all of the features we desire.

The Simple Factory is just a Singleton (or just an static class in most programming languages, but in JavaScript, they’re essentially the same) that has one or more functions for creating and returning objects. If you look at the code below, you’ll see that object written and how to use it.

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

var CarFactory = {

    // One function to make a car with any combo of features

    makeCar: function (features) {

        var car = new Car();

        // If they specified some features then add them

        if (features &amp;&amp; features.length) {

            var i = 0,

                l = features.length;

            // iterate over all the features and add them

            for (; i < l; i++) {

                var feature = features\[i\];

                switch(feature) {

                    case 'powerwindows':

                        car = new PowerWindowsDecorator(car);

                        break;

                    case 'powerlocks':

                        car = new PowerLocksDecorator(car);

                        break;

                    case 'ac':

                        car = new ACDecorator(car);

                        break;

                }

            }

        }

        return car;

    }

}

// Call the factory method. Send in an array of strings

// representing the features you want your car to have

var myCar = CarFactory.makeCar(\['powerwindows', 'ac'\]);

// If you want a plain old car, just don't send in an array

var myCar = CarFactory.makeCar();

[](#Making-the-Factory-Better "Making the Factory Better")Making the Factory Better
-----------------------------------------------------------------------------------

Our Decorator example had some additional problems that were not solved in the previous code snippet, though the Simple Factory can make it easier to solve those problems. Problem number 1 was that there was no way to ensure that a feature wasn’t added more than once. For instance, you could have several `PowerWindowDecorator`s wrapping the same car, which wouldn’t make much sense. The other problem was that if the features should be added in any specific order, there was once again no particular way of enforcing that rule.

We can fix both of those problems using the Factory pattern. The best part is that none of this logic needs to be contained within the `Car` object or the decorator objects. It is all in one place: the factory, which in a real-world perspective makes sense. Do you see the car or its features knowing how to add features or which order to install them in? No, this is handled at the factory.

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

var CarFactory = {

    makeCar: function (features) {

        var car = new Car(),

            // create a list of all the possible features and set them to 0,

            // which means it won't be included

            featureList =  {

                powerwindows: 0,

                powerLocks: 0,

                ac: 0

            };

        // If they specified some features then add them

        if (features &amp;&amp; features.length) {

            var i = 0,

                l = features.length;

            // iterate over all the features and add them

            for (; i < l; i++) {

                // mark the feature in the featureList as a feature

                // that will be included. This way we only get one of

                // each feature.

                featureList\[features\[i\]\] = 1;

            }

            // Now we add the features on in a specific order

            if (featureList.powerwindows) {

                car = new PowerWindowsDecorator(car);

            }

            if (featureList.powerlocks) {

                car = new PowerLocksDecorator(car);

            }

            if (featureList.ac) {

                car = new ACDecorator(car);

            }

        }

        return car;

    }

}

// Now you can have some careless programmer call this

var myCar = CarFactory.makeCar(\['ac', 'ac', 'powerlocks', 'powerwindows', 'ac'\]);

// and it will still give you a car with only 1 ACDecorator and it will be built

// in the correct order.

Can you now see why the Simple Factory is one of my favorite patterns? It takes all of the tedious bits out of object creation. Granted using a factory to create a single object that does not adhere to any interface except its own is pretty much just idiotic.

[](#Another-Way "Another Way")Another Way
-----------------------------------------

The Factory’s power isn’t limited to Decorators. Basically any objects that share an interface can all be created using a Factory, which helps decouple those individual objects from your code. All you know for certain is what type of object you’ll receive from the Factory so the only thing you’re dependent on is the Factory and an interface, no matter how many different objects implement that interface.

How about I show an example of using the Factory for non-Decorator purposes? The next Factory is going to be part of a fictional MVC framework. The Factory can get a model object of the specified type and ship it back to the controller.

Different controllers use different models and even within the same controller it might use a different model for different methods. Instead of hard coding the specific model “class” names into the controller, we use the factory to fetch the model for us. This way if we change to a new model class (maybe we decided to use a different type of database) the only place where we need to make changes is in the factory. I won’t go into the details of how to implement this, because that would be a waste of time. We’ll just show how it’s used and I’ll let you use your imagination for the implementation code. Below you’ll see the code for a controller that uses the factory.

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

// This controller uses two different models: car and cars

var CarController = {

    getCars: function () {

        var model = ModelFactory.getModel('cars');

        return model.get('all');

    },

    getCar: function (id) {

        var model = ModelFactory.getModel('car');

        return model.get(id);

    },

    createCar: function () {

        var model = ModelFactory.getModel('car');

        model.create();

        return model.getId();

    },

    deleteCars: function (carIds) {

        var model = ModelFactory.getModel('cars');

        model.delete(carIds);

    },

    .

    .

    .

}

[](#Bringing-this-Madness-to-an-End "Bringing this Madness to an End")Bringing this Madness to an End
-----------------------------------------------------------------------------------------------------

Finishing already? What about the normal Factory? I believe this post has become long enough, don’t you? How about we reconvene on Wednesday for another post dedicated entirely to the normal Factory Pattern? There should be enough code to write that it shouldn’t be too short. Besides, this gives you some time to absorb the knowledge you gained here before I fill your head with more nonsense.

So, if you ever run into the Decorator Pattern or into any group of objects using the same interface, make sure you consider using the Factory Pattern to accomplish the creation of those object in order to remove the dependencies on those objects. Also, make sure to leave a comment below if there’s anything you want to shout out to myself or the community. Remember, it’s your comments that make this a community to get involved in, rather than just a blog with static text.

**JavaScript Design Patterns series:**

*   [Singleton Pattern](/javascript/javascript-design-patterns-singleton/ "JavaScript Design Patterns: Singleton")
*   [Bridge Pattern](/javascript/javascript-design-patterns-bridge/ "JavaScript Design Patterns: Bridge")
*   [Composite Pattern](/javascript/javascript-design-patterns-composite/ "JavaScript Design Patterns: Composite")
*   [Facade Pattern](/javascript/javascript-design-patterns-facade/ "JavaScript Design Patterns: Facade")
*   [Adapter Pattern](/javascript/javascript-design-patterns-adapter/ "JavaScript Design Patterns: Adapter")
*   [Decorator Pattern](/javascript/javascript-design-patterns-decorator/ "JavaScript Design Patterns: Decorator")
*   [Factory Pattern Part 1](/javascript/javascript-design-patterns-factory/ "JavaScript Design Patterns: Factory")
*   [Factory Pattern Part 2](/javascript/javascript-design-patterns-factory-part-2/ "JavaScript Design Patterns: Factory Part 2")
*   [Proxy Pattern](/javascript/javascript-design-patterns-proxy/ "JavaScript Design Patterns: Proxy")
*   [Observer Pattern](/javascript/javascript-design-patterns-observer/ "JavaScript Design Patterns: Observer")
*   [Command Pattern](/javascript/javascript-design-patterns-command/ "JavaScript Design Patterns: Command")
*   [Chain of Responsibility Pattern](/javascript/javascript-design-patterns-chain-of-responsibility/ "JavaScript Design Patterns: Chain of Responsibility")