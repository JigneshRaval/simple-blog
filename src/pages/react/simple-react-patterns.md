---
path: "React/simple-react-patterns"
date: "2018-10-03"
title: "Simple React Patterns"
tags: ["React","Pattern"]
category: "React"
categoryColor: "#F3C610"
excerpt: ""
coverImage: ""
sourceUrl: "http://lucasmreis.github.io/blog/simple-react-patterns/"
type: "Post"
---

Simple React Patterns
=====================

Dealing With Side-Effects In React

I've been writing React applications for a few years now, and I've noticed that some patterns tend to repeat themselves. In this post, I'll review these patterns which will summarize about 99% of the React code I write every day.

As a sample spec, let's build an app that fetches information about the Dagobah planet from Star Wars API and shows it to the user.

Simple everyday patterns
------------------------

About 95% of the code written every day will be either simple view components or components with some logic. This is the first pattern, and it's the easiest one:

### The Vanilla or Mixed Pattern

```
export default class Dagobah extends React.Component {
  // State:
  // { loading: true }
  // { loading: false, planet: { name, climate, terrain } }
  // { loading: false, error: any }
  state = { loading: true };

  componentDidMount() {
    fetch("https://swapi.co/api/planets/5")
      .then(res => res.json())
      .then(
        planet => this.setState({ loading: false, planet }),
        error => this.setState({ loading: false, error })
      );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return <div>I'm sorry! Please try again.</div>;
  }

  renderPlanet() {
    const { name, climate, terrain } = this.state.planet;
    return (
      <div>
        <h2>{name}</h2>
        <div>Climate: {climate}</div>
        <div>Terrain: {terrain}</div>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading();
    } else if (this.state.planet) {
      return this.renderPlanet();
    } else {
      return this.renderError();
    }
  }
}
```

This is a _vanilla_ React component, something you will write after reading the docs. Writing a component like this one has its benefits: the main one is that it's easy, and it's self-contained. Plug a `<Dagobah />` anywhere in your application, and it will fetch and render the data.

**Side note**: whenever we deal with fetching data from somewhere in a way that may take time or fail, _we need to define views for those states_. We always need to define a view for the loading state and a view for the error state. No network is perfect, and we need to prepare our app for problems! You can even define more intricate logic, such as waiting milliseconds before showing the loading view to avoid blinking screens, and so on. This is a great subject, but I won't go further in this blog post. I'll stick to the simple Loading / Error / Success pattern in all the examples.

So, what problems could this component have? Let's say we want to use a style guide tool like [Storybook](https://storybook.js.org/) to render the component in all three states to be able to polish each version well or even showcase it to other teams. Is it possible? What if I want to unit test the view without fetching the data every time, or without mocking the requests? It's not going to happen.

Both the logic and the view are intertwined in one indivisible component, and that's why I also call this pattern the _Mixed Component_ pattern. For a better workflow and simpler, more testable and more maintainable code, we need to separate the logic and the view. And that's why this second pattern is probably the most useful, and the one I try to use as much as possible:

### The Container / View Pattern

```
class PlanetView extends React.Component {
  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return <div>I'm sorry! Please try again.</div>;
  }

  renderPlanet() {
    const { name, climate, terrain } = this.props.planet;
    return (
      <div>
        <h2>{name}</h2>
        <div>Climate: {climate}</div>
        <div>Terrain: {terrain}</div>
      </div>
    );
  }

  render() {
    if (this.props.loading) {
      return this.renderLoading();
    } else if (this.props.planet) {
      return this.renderPlanet();
    } else {
      return this.renderError();
    }
  }
}

// State:
// { loading: true }
// { loading: false, planet: { name, climate, terrain } }
// { loading: false, error: any }

class DagobahContainer extends React.Component {
  state = { loading: true };

  componentDidMount() {
    fetch("https://swapi.co/api/planets/5")
      .then(res => res.json())
      .then(
        planet => this.setState({ loading: false, planet }),
        error => this.setState({ loading: false, error })
      );
  }

  render() {
    return <PlanetView {...this.state} />;
  }
}

export default DagobahContainer;
```

That's it. You've just seen the majority of the code I write today. A simple view-only generic planet component, and a logic-only component, that simply calls the view in its render function.

With the separated view component, we can very easily use it in a style guide, and fine tune each of the variants just by providing different props. Also, we can easily test the view using [Enzyme](https://github.com/airbnb/enzyme) for instance.

Also, my experience shows that this pattern scales better: maybe one of the view states gets big, and it's straightforward to extract it through a new component. On the logic side, it's also much easier to understand and change code not polluted with view related stuff.

Notice that the view component has some "if" logic to define what to render. We can extract it into its own component, in what could be considered a variant of the Container / View pattern:

### The Container / Branch / View Pattern

```
const LoadingView = () => <div>Loading...</div>;

const ErrorView = () => <div>I'm sorry! Please try again.</div>;

const PlanetView = ({ name, climate, terrain }) => (
  <div>
    <h2>{name}</h2>
    <div>Climate: {climate}</div>
    <div>Terrain: {terrain}</div>
  </div>
);

const PlanetBranch = ({ loading, planet }) => {
  if (loading) {
    return <LoadingView />;
  } else if (planet) {
    return <PlanetView {...planet} />;
  } else {
    return <ErrorView />;
  }
};

// State:
// { loading: true }
// { loading: false, planet: { name, climate, terrain } }
// { loading: false, error: any }

class DagobahContainer extends React.Component {
  state = { loading: true };

  componentDidMount() {
    fetch("https://swapi.co/api/planets/5")
      .then(res => res.json())
      .then(
        planet => this.setState({ loading: false, planet }),
        error => this.setState({ loading: false, error })
      );
  }

  render() {
    return <PlanetBranch {...this.state} />;
  }
}

export default DagobahContainer;
```

Now the individual views are even more isolated, which can help the testing, showcasing and development workflow. Deciding how much to break the view is best done with a case by case analysis, and the rule of thumb is to keep it simple to understand. This can vary a lot, so use your best judgment!

The only situation that these initial patterns are not useful for is when we need to _reuse the logic with different views_. These can be interesting cases, and there are two main ways of dealing with them. Let start with the "oldest" one:

Higher Order Components
-----------------------

Higher-Order Components (HOCs) are simply functions that take at least one component as a parameter and return another component. Usually it adds props to the passed component after doing some work. For instance, we could have a `withDagobah` HOC that fetches info about Dagobah and passes the result as a prop:

```
const withDagobah = PlanetViewComponent =>
  class extends React.Component {
    state = { loading: true };

    componentDidMount() {
      fetch("https://swapi.co/api/planets/5")
        .then(res => res.json())
        .then(
          planet => this.setState({ loading: false, planet }),
          error => this.setState({ loading: false, error })
        );
    }

    render() {
      return <PlanetViewComponent {...this.state} />;
    }
  };

export default withDagobah(PlanetBranch);
```

Now, all the planet fetching logic is inside this HOC, and is _not dependent on any view logic_. It does not have any dependency on any particular React views, and it only adds some props to a passed component. That way, you can, for instance, use it in all your routes, with different components rendering planets differently.

**Note:** if you use this HOC in two components being rendered on the same screen, it will fetch the data twice. Fetching data is an expensive side effect, and usually, we try to do it as little as possible. I'll talk about how to deal with it in the last pattern of this post, so keep on reading! :)

A HOC can also accept different parameters to define its behavior. We could have for instance a `withPlanet` HOC that fetches different planets:

```
const hoc = withPlanet('tatooine');
const Tatooine = hoc(PlanetView);

// somewhere else inside a component:
render() {
  return (
    <div>
      <Tatooine />
    </div>
  );
}
```

An example of a HOC with this ability is [react-sizeme](https://github.com/ctrlplusb/react-sizeme). It receives an options object and a component and returns another component with a `size` prop containing height, width, and position information.

So, what are the cons of HOCSs? The first painful one is that every view that will be used with the HOC has to understand the shape of the props passed. In our example, we add `loading`, `error` and `planet`, and our views need to be prepared for it. Sometimes we have to have a component whose only purpose is transforming props into the intended ones, and that feels inefficient (interestingly, one of the most used HOCs does not have this problem: [react-redux](https://github.com/reactjs/react-redux)'s `connect`, because the user decides the shape of the props passed to the view component).

Some HOCs will always lead to branched views, like our `withDagobah` that almost always will be viewed with Loading, Error and Success views. That can give rise to a HOC variant:

### Variation: Branching Higher Order Components

We can put the branching logic inside the HOC:

```
const withDagobah = ({
  LoadingViewComponent,
  ErrorViewComponent,
  PlanetViewComponent
}) =>
  class extends React.Component {
    state = { loading: true };

    componentDidMount() {
      fetch("https://swapi.co/api/planets/5")
        .then(res => res.json())
        .then(
          planet => this.setState({ loading: false, planet }),
          error => this.setState({ loading: false, error })
        );
    }

    render() {
      if (this.state.loading) {
        return <LoadingViewComponent />;
      } else if (this.state.planet) {
        return <PlanetViewComponent {...this.state.planet} />;
      } else {
        return <ErrorViewComponent />;
      }
    }
  };

// and the HOC would be called like this:
export default withDagobah({
  LoadingViewComponent: LoadingView,
  ErrorViewComponent: ErrorView,
  PlanetViewComponent: PlanetView
});
```

There's a trade-off here: even though the views are simpler, there's more logic inside the HOC. It's only worth it if you know that more than one view is going to be used and that the branching logic will be the same every time. An example of a branching HOC is [react-loadable](https://github.com/thejameskyle/react-loadable), which accepts both a dynamically loaded component and a Loading component that handles both the loading and the error state.

Render Props
------------

There is another widely used pattern that separates the logic from the view, the Render Props (also known as Children as Function). [Some people swear by it](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce),and some people [consider it an anti-pattern](http://americanexpress.io/faccs-are-an-antipattern/). Opinions aside, this is how our Dagobah logic would be implemented as a Render Prop:

```
class DagobahRP extends React.Component {
  state = { loading: true };

  componentDidMount() {
    fetch("https://swapi.co/api/planets/5")
      .then(res => res.json())
      .then(
        planet => this.setState({ loading: false, planet }),
        error => this.setState({ loading: false, error })
      );
  }

  render() {
    return this.props.render(this.state);
  }
}

// notice that a function is passed to the render prop:
export default () => (
  <DagobahRP
    render={({ loading, error, planet }) => {
      if (loading) {
        return <LoadingView />;
      } else if (planet) {
        return <PlanetView {...planet} />;
      } else {
        return <ErrorView />;
      }
    }}
  />
);
```

**Note:** in the Render Props debate, the performance issue has been raised many times. This post shows how [it's not a straightforward issue](https://cdb.reacttraining.com/react-inline-functions-and-performance-bdff784f5578). Anytime we talk about performance, we should also be talking about measurements. If you have any doubts about performance on a specific issue, load your profilers and measure it! :)

I tend to feel that the benefits of HOCs versus Render Props vary from situation to situation. At my previous job, we tended to write more Render Props, and at my current job we tend to write more HOCs, and I don't feel those choices made either of the teams more productive, or the code more readable in general. I feel one pattern is better than the other whenever I see it in the code, but as I said, it's on a case by case basis. As always, use your better judgment.

The first time I saw the Render Props pattern was in the [React Motion library](https://github.com/chenglou/react-motion). [React Router v4](https://reacttraining.com/react-router/web/api/Route/render-func) is another large library implementing it. The two authors are probably the most influential render props enthusiasts, and they have a couple of other [small libraries](https://reacttraining.com/react-idle/) [using it](https://reacttraining.com/react-network/).

Render props can also lead to a lot of branching views code, so I feel I also should register here the Branching Render Props variant:

### Variation: Branching Render Props

```
class DagobahRP extends React.Component {
  state = { loading: true };

  componentDidMount() {
    fetch("https://swapi.co/api/planets/5")
      .then(res => res.json())
      .then(
        planet => this.setState({ loading: false, planet }),
        error => this.setState({ loading: false, error })
      );
  }

  render() {
    if (this.state.loading) {
      return this.props.renderLoading();
    } else if (this.state.planet) {
      return this.props.renderPlanet(this.state.planet);
    } else {
      return this.props.renderError(this.state.error);
    }
  }
}

// different callback for different branches:
export default () => (
  <DagobahRP
    renderLoading={() => <LoadingView />}
    renderError={error => <ErrorView />}
    renderPlanet={planet => <PlanetView {...planet} />}
  />
);
```

And that's it.

What if the side effects are costly?
------------------------------------

In a lot of situations, the logic provided by the HOC or Render Prop leads to costly code that we want to avoid if possible. The most common case is fetching data remotely. In our Dagobah case, we would like for instance to fetch the planet data only once, and make it available to view components through HOCs or render props. How would we achieve it?

The Provider Pattern
--------------------

This is one of the most powerful patterns in React. It's relatively simple: you gather your data, put it in the React context object, and then in a HOC (or Render Prop) you access the context object and pass it as a prop to the intended components. If you don't know what the context object is in React, please [head to the official docs](https://reactjs.org/docs/context.html).

Let's implement it for our Dagobah example. First, we need to implement the `DagobahProvider`:

```
import React from "react";
import PropTypes from "prop-types";

// IMPORTANT: we need to define childContextTypes
// to be able to access the context object in React
const contextTypes = {
  dagobah: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    planet: PropTypes.shape({
      name: PropTypes.string,
      climate: PropTypes.string,
      terrain: PropTypes.string
    })
  })
};

export class DagobahProvider extends React.Component {
  state = { loading: true };

  componentDidMount() {
    fetch("https://swapi.co/api/planets/5")
      .then(res => res.json())
      .then(
        planet => this.setState({ loading: false, planet }),
        error => this.setState({ loading: false, error })
      );
  }

  static childContextTypes = contextTypes;

  getChildContext() {
    return { dagobah: this.state };
  }

  render() {
    return this.props.children;
  }
}
```

The provider uses the same logic we had before, and it's handled in the `componentDidMount` method. The only difference to the previous implementations is that it adds a `dagobah` property to the context object, via the `getChildContext` method. Then, it simply renders its children by returning the children props in the render method.

Now, any component under the provider will have access to the `dagobah` object inside the context. But accessing the context object in a component is usually considered bad practice, since the context is kind of an "invisible" input, and it makes testing and reasoning about the code a little bit tougher. Let's implement a HOC to access the context and inject the `dagobah` object in a component props:

```
const withDagobah = PlanetViewComponent =>
  class extends React.Component {
    static contextTypes = contextTypes;

    render() {
      const { props, context } = this;
      return <PlanetViewComponent {...props} {...context.dagobah} />;
    }
  };
```

Easy, right? Notice the `contextTypes` property: we need it to be defined with the same schema of the provider to be able to access the context. Then, we spread it to the passed component. That way, we can use as many `withDagobah` in the same screen, and data will only be fetched once!

And of course, we could also access the context through a Render Props:

```
const DagobahRp = ({ render }, { dagobah }) => render(dagobah);

DagobahRp.contextTypes = contextTypes;
```

Very easy too! And this is how we could use it in an application:

```
const DagobahPlanet = withDagobah(View);

class App extends Component {
  render() {
    return (
      <DagobahProvider>
        <DagobahPlanet />
        <DagobahPlanet />
        <DagobahPlanet />
        <DagobahRp render={props => <View {...props} />} />
        <DagobahRp render={props => <View {...props} />} />
        <DagobahRp render={props => <View {...props} />} />
      </DagobahProvider>
    );
  }
}
```

Dagobah is going to be rendered six times, and data will only be fetched once.

A lot of libraries use the Provider pattern, including the aforementioned [react-redux](https://github.com/reactjs/react-redux) and [React Router v4](https://reacttraining.com/react-router/web/api/Route/render-func). [React-intl](https://github.com/yahoo/react-intl) is also a good example of the pattern.

Going back to the percentages, I would say my React code (and most I've come across) is about 99% written using those patterns. The other 1% would be weird integration code with some non-React libraries. Also, most of the main React libraries will fall in one of the categories above! Learn how they work, why they exist and you'll understand most of the React world :)

Summary
-------

Regular React components work well most of the time, but it's better to try separating logic from view. If you need to reuse logic for different view components, use HOCs or Render Props. If the logic involves expensive side effects that should only run once, use a provider.

The code used in this post can [be found here](https://github.com/lucasmreis/react-patterns/tree/master/src/planet).

October 8, 2017.