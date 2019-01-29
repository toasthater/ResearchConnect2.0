import React, { Component } from 'react';
import NavBar from './NavBar';
import Landing from './Landing';
import Home from './Home';
import About from './About';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ErrorBoundary from './ErrorBoundary';

NavLink.defaultProps.activeClassName = 'is-active';



class App extends Component {
  

  componentDidMount() {
      this.props.fetchUser();
  }



  render() {
    return (
      <Router>
        <>
          <NavBar/>
          <ErrorBoundary>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact component={Landing} path="/welcome" />
              <Route exact component={About} path="/about" />
              <Route render={() => { throw new Error({code: 404}); }} />
            </Switch>
          </ErrorBoundary>
          <Route render={({ history }) => {
          // Auto-update service worker on route change
          history.listen(() => {
            if (window.swUpdate === true) window.location.reload();
          });
          return null;
        }} />
        </>
      </Router>
    );
  }
}

export default connect(null, actions)(App);
