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

const PrivateRoute = ({ loggedIn, component, ...rest }) => (
  <Route {...rest} component={loggedIn ? component : Landing}/>
);
class App extends Component {

  componentDidMount() {
      this.props.fetchUser();
      console.log(this.props.auth);
  }

  render() {
    return (
      <Router>
        <>
          <NavBar/>
          <ErrorBoundary>
            <Switch>
              <PrivateRoute exact path="/" component={Home} loggedIn={this.props.auth} />
              <Route exact path="/about" component={About} />
              {/* This is how you would use a PrivateRoute */}
              {/* <PrivateRoute exact path="/about" component={About} loggedIn={this.props.auth} /> */}
              <Route render={() => { throw new Error({code: 404}); }} />
              {(this.props.auth) ? <></> : <Redirect from="/*" to="/"/>}
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

function mapStateToProps({auth}){
  return { auth };
}

export default connect(mapStateToProps, actions)(App);
