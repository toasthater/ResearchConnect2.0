import React, { Component } from "react";
import NavBar from "./NavBar";
import Landing from "./Landing";
import Home from "./Home";
import About from "./About";
import Profile from "./Profile";
import Spinner from "./Spinner";
// import studentForm from "./StudentForm";
import SearchResults from "./SearchResults";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import ErrorBoundary from "./ErrorBoundary";
import Setup from "./Setup";
import PageNotFound from "./ErrorPage";

NavLink.defaultProps.activeClassName = "is-active";

const PrivateRoute = ({ loggedIn, accountSetup, component, ...rest }) => (
  <Route {...rest} component={loggedIn ? accountSetup ? component : Setup : Landing}/>
);

class App extends Component {
  componentDidMount() {
    this.props.fetchUser().then(_ => {
      if (this.props.auth.isProfessor) {
        console.log("Fetching professor..");
        this.props
          .fetchFacultyMember(this.props.auth.cruzid)
          .then(_ => console.log(this.props.profile));
      } else {
        console.log("Fetching student..");
        this.props
          .fetchStudent(this.props.auth.cruzid)
          .then(_ => console.log(this.props.profile));
      }
    });
  }

  render() {
    return this.props.loadState !== 0 ? (
      <Router>
        <>
          <NavBar />
          <ErrorBoundary>
            <Switch>
              <PrivateRoute
                exact
                path="/"
                component={Home}
                loggedIn={this.props.auth}
                accountSetup={this.props.auth.isSetup}
              />
              <Route exact path="/about" component={About} />
              <Route exact path="/profile" component={Profile} />
              {/* <Route exact path="/studentForm" component={studentForm} /> */}
              <Route exact component={SearchResults} path="/search_results" />
              {/* This is how you would use a PrivateRoute */}
              {/* <PrivateRoute exact path="/about" component={About} loggedIn={this.props.auth} /> */}
              <Route component={PageNotFound}/>
              {this.props.auth ? <></> : <Redirect from="/*" to="/" />}
            </Switch>
          </ErrorBoundary>
          <Route
            render={({ history }) => {
              // Auto-update service worker on route change
              history.listen(() => {
                if (window.swUpdate === true) window.location.reload();
              });
              return null;
            }}
          />
        </>
      </Router>
    ) : this.props.loadState === 1 ? (
      <Spinner fullPage />
    ) : (
      <>
        <NavBar />
        <Spinner fullPage />
      </>
    );
  }
}

function mapStateToProps({ auth, profile, loadState }) {
  return { auth, profile, loadState };
}

export default connect(
  mapStateToProps,
  actions
)(App);
