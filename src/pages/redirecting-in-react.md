---
path: "/blog/redirecting-in-react"
date: "2018-05-21"
title: "Redirecting in React"
tags: ["React", "Authentication", "Redirect"]
category: "React"
categoryColor: '#F3C610'
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app. When a website requires no server interaction whatsoever, what is hosted on the web is served to a user as is, this is referred to as a static site."
coverImage: '/images/fpxoowbr6ls-matthew-henry.jpg'
sourceUrl: 'https://medium.com/@anneeb/redirecting-in-react-4de5e517354a'
type: 'Post'
---

# Redirecting in React

## Sometimes you just want to get away…

Single page websites are great because they dynamically update as the user interacts with application, thus allowing for shorter loading times between pages. Although the page never actually reloads or sends you to a new route, the app mimics this behavior by manipulating the window's history or location objects. Using a link to navigate to a new page with is pretty straightforward: a user interacts with an element, and that event triggers the history or location change. Redirecting proves to be more difficult, as the routing action needs to be fired based on the state of the application.

#### Redirect Component

If you have routes in your React app, you're probably using React Router (or React Router DOM) to set up your routes. Considering you've already installed the React Router library, the easiest way to redirect to a new location is by using its Redirect component. When the component is rendered, the existing location of the history object is replaced with a new location. If you don't want to override the existing history location, including the `push` property will push a new entry onto the history.

    import React from 'react'
    import { Redirect } from 'react-router-dom'

    class MyComponent extends React.Component {

    state = {
        redirect: false
    }

    setRedirect = () => {
        this.setState({
        redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
        return <Redirect to='/target'>
        }
    }

    render () {
        return (
        <div>
            {this.renderRedirect()}
            <button onClick={this.setRedirect()}>Redirect</button>
        </div>
        )
    }

    }


This route (haha) is not the best if you're not a fan of controlled components, that is, it has and is responsible for its own state. Luckily, we can still accomplish this behavior manually by passing props!

#### Route Component Props

The Route component provides three props to whatever component it renders: location, match and history. Passing down these props to a nested component gives us access to the history object, which we can then push a new location onto.

    import React from 'react'
    import { BrowserRouter, Route } from 'react-router-dom'

    class MyRouter extends React.Component {

    render () {
        return (
        <BrowserRouter>
            <Route
            path='/'
            render={ props => <MyComponent {...props} />}
            />
        </BrowserRouter>
        )
    }

    }

    class ParentComponent extends React.Component {

    render () {
        return <ChildComponent {...this.props} />
    }

    }

    class ChildComponent extends React.Component {

    redirectToTarget = () => {
        this.props.history.push(`/target`)
    }

    render () {
        return (
        <div>
            {this.renderRedirect()}
            <button onClick={this.redirectToTarget()}>Redirect</button>
        </div>
        )
    }

    }

But what if the component that needs the redirect functionality is nested super deep? Passing these props through all the components between the route and your child component is not ideal, so here is a third (but not recommended) option: Context and PropTypes

#### Context and PropTypes

In order to add the context parameter to a React component, we need to define context types as a PropTypes.object. This passes the props directly from the Router component to our child component. Now that we have access to the router props, we also have access to the history, and can push a new entry onto it with a new target location.

    import React from 'react'
    import { BrowserRouter, Route } from 'react-router-dom'
    import PropTypes from 'prop-types'

    class MyRouter extends React.Component {

    render () {
        return (
        <BrowserRouter>
            <Route path='/' component={MyComponent} />
        </BrowserRouter>
        )
    }

    }

    class ParentComponent extends React.Component {

    render () {
        return <ChildComponent />
    }

    }

    class ChildComponent extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    redirectToTarget = () => {
        this.context.router.history.push(`/target`)
    }

    render () {
        return (
        <div>
            {this.renderRedirect()}
            <button onClick={this.redirectToTarget()}>Redirect</button>
        </div>
        )
    }

    }
