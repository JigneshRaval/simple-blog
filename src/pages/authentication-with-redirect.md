---
path: "/blog/authentication-with-redirect"
date: "2018-05-21"
title: "Authentication with Redirect"
tags: ["React", "Authentication", "Redirect"]
category: "React"
categoryColor: '#F3C610'
excerpt: "Since the advent of the modern web, performance has been a key consideration when designing a website or a web app. When a website requires no server interaction whatsoever, what is hosted on the web is served to a user as is, this is referred to as a static site."
coverImage: '/images/fpxoowbr6ls-matthew-henry.jpg'
sourceUrl: 'https://scotch.io/courses/using-react-router-4/authentication-with-redirect'
type: 'Post'
---

Authentication with Redirect
============================

There will be times that we need to protect certain pages or routes so only authorized people can access them. We can use the `Redirect` component supplied to us by `react-router-dom` to direct users away from pages they shouldn't be able to get to. Returning a `Redirect` component will cause the page to redirect to the page we desire.

To demonstrate this, let's add a login form to protect our CMS from unauthenticated users. This will be a very simple login form. In a real scenario, you will want to talk to a backend database to validate user credentials and have a form of authorization in place to make sure logged-in users have the corect permissions to change things. Also, all permissions should be doublechecked on the backend server as well before allowing changes to happen. However, the conecpt of using the `Redirect` component will be the same.

We will start out by reviewing everything we have seen so far. Start off by adding a new `Route` for our login page at `/login` in the `App` component.

    import React from 'react';
    import { Switch, Route } from 'react-router-dom';
    import Cms from './Cms';
    import Login from './Login';

    const App = () => (
      <div className="app-routes">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Cms} />
        </Switch>
      </div>
    );

    export default App;

Notice we have wrapped our routes in a `Switch` component and put the login route above our root route. This is because at `/login`, both `Route`s will match. View this in the browser at `/login`.

Next we need to hook things up so that we are taken to our root route after we have a successful login. Update the `onSubmit` method in `src/fe/components/Login/index.js` to look like the below.

    onSubmit(e) {
      e.preventDefault();

      const { username, password } = this.state;
      const { history } = this.props;

      this.setState({ error: false });

      if (!(username === 'george' && password === 'foreman')) {
        return this.setState({ error: true });
      }

      store.set('loggedIn', true);
      history.push('/users');
    }

Now, if you try logging in with a username of `george` and the password of `foreman`, it should send you to `/users`. Now, let's do something similar in the `Cms` component. Let's send the user to the login form when they logout. First, pull `history` out of props.

    const Cms = ({ history }) => {

Next, pass `history` as the only argument to our `handleLogout` call as the `onClick` handler for the "Logout" `Menu.Item`.

    <Menu.Item name="logout" onClick={handleLogout(history)}>

This is a function that returns a callback function to be called. We pass it `history` so that it will be within its scope for us to use later. Now update the `handleLogout` function to look like this.

    const handleLogout = history => () => {
      store.remove('loggedIn');
      history.push('/login');
    };

We are now accepting the `history` object and using it to navigate to the login form after removing the local data we are using to track if a user is logged in.

Now that all that stuff is hooked up, let's protect our CMS routes. We need to check if a user is logged in, and if they are not, we will redirect them back to the login page. Instead of pushing onto the `history` object, we can use the `Redirect` component to do this for us. Add this to the top of the `Cms` component.

    if (!isLoggedIn()) {
      return <Redirect to="/login" />;
    }

Make sure to import the `isLoggedIn` helper and the `Redirect` component.

    import { Route, Link, Switch, Redirect } from 'react-router-dom';
    import isLoggedIn from '../../helpers/is_logged_in';

Now, make sure you are logged out, and try navigating to the `/users` page. Notice, how we are redirected right back to the login page. Try going to a user's edit page, such as `/users/3/edit`. It redirects us right back again! That was simple.

To demonstrate this again, let's make it so that if we are logged in and try to access the login page, we are redirected to the users table page. At the top of the `render` method in the `Login` component, add the following.

    if (isLoggedIn()) {
      return <Redirect to="/users" />;
    }

Make these are imported at the top of the page.

    import { Redirect } from 'react-router-dom';
    import isLoggedIn from '../../helpers/is_logged_in';

Now, log in and try navigating to `/login`. You will be redirected right back `/users` just like we wanted!

In the last video, we will wrap up everything we have learned and discuss where to go next.
