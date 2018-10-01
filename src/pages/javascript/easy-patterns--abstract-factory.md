---
path: "JavaScript/easy-patterns--abstract-factory"
date: "2018-09-25"
title: "Easy patterns: Abstract factory"
tags: ["JavaScript","Pattern"]
category: "JavaScript"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "https://itnext.io/easy-patterns-abstract-factory-2325cb398fc6"
type: "Post"
---

Easy patterns: Abstract factory
===============================

![](https://cdn-images-1.medium.com/max/800/1*UmKKDvmeIUGY3gbPLvYYQQ.png)

This article is created in continuation of easy patterns series description and presents Abstract factory pattern which solves the problem of instantiating look-and-feel specific classes throughout the application.

#### Creational patterns:

> [**Simple Factory**](https://itnext.io/easy-patterns-simple-factory-b946a086fd7e)

> [**Factory method**](https://itnext.io/easy-patterns-factory-method-5f27385ac5c)

> [**Singleton**](https://itnext.io/easy-patterns-singleton-283356fb29bf)

> [**Abstract factory**](https://itnext.io/easy-patterns-abstract-factory-2325cb398fc6)  _(this article)_

#### Structural patterns:

> [**Adapter**](https://itnext.io/easy-patterns-adapter-9b5806cb346f)

> [**Decorator**](https://itnext.io/easy-patterns-decorator-eaa96c0550ea)

> [**Bridge**](https://itnext.io/easy-patterns-bridge-28d50dc25f9f)

#### Behavioral patterns:

> [**Visitor**](https://itnext.io/easy-patterns-visitor-b8ef57eb957)

> [**Mediator**](https://itnext.io/easy-patterns-mediator-e0bf18fefdf9)

> [**Observer**](https://itnext.io/easy-patterns-observer-63c832d41ffd)

> [**Memento**](https://itnext.io/easy-patterns-memento-ce966cec7478)

### The main essence

This pattern is also known as a Kit.

The Abstract factory pattern describes a method of individual fabrics composition, that are grouped together by some common criteria.

This pattern includes four main roles:

*   **AbstractFactory — **declares an interface for operations that create product object.
*   **ConcreteFactory **— implements the operations to create concrete product objects
*   **Product **— defines a product object to be created by the corresponding concrete factory
*   **Client **— uses only interfaces declared by AbstractFactory and Product classes.

The idea is really simple. The AbstractFactory defers creation of a product objects to its ConcreteFactory subclass. To create separate product object client have to use separate ConcreteFactories.

### Example of use

The abstract factory classes are often implemented with [Factory Method pattern](https://itnext.io/easy-patterns-factory-method-5f27385ac5c). ConcreteFactory is often a [Singleton](https://itnext.io/easy-patterns-singleton-283356fb29bf) (that is reasonable from the perspective that ConcreteFactory should create a concrete family of classes).

In example we are creating several products: CodeSnippets and CodeParsers. Each code snippet should correspond to specific code parser. That's why it makes sense to create CodeProcessorFactories that create code snippet and code parser in tandem.

![](https://i.embed.ly/1/display/resize?url=https%3A%2F%2Favatars3.githubusercontent.com%2Fu%2F3177052%3Fs%3D400%26v%3D4&key=a19fcc184b9711e1b4764040d3dc5c07&width=40)

### Profit

This pattern isolates concrete classes. It helps you to control the classes of object that application creates. The AbstractFactory interface defines the way a Client should manipulate instances.

This makes it easy to change the concrete factory an application uses. It can use different product configurations simply by changing the concrete factory.

It promotes consistency among products. When the products across in a family are designed to work together, it's important that an application uses objects from only one family at a time.

### Weak places

Extending abstract factories to produce new kinds of Products isn't easy. AbstractFactory interface fixes the set of products that can be created. Supporting new kinds of products requires extending the AbstractFactory interface, which involves changing of all its subclasses as well.

### Conclusion

If you found this article helpful, please hit the 👏 button and feel free to comment below!
