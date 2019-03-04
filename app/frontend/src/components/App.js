import React, { Component } from "react";
import NavBar from "./NavBar";
import Landing from "./Landing";
import Home from "./Home";
import About from "./About";
import Profile from "./Profile";
import ResearchPost from "./ResearchPost";
import Spinner from "./Spinner";
import EditProfile from "./EditProfile";
import SearchResults from "./SearchResults";
import Applicants from "./Applicants";
import { Route, Switch, NavLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import ErrorBoundary from "./ErrorBoundary";
import Setup from "./Setup";
import PageNotFound from "./ErrorPage";

NavLink.defaultProps.activeClassName = "is-active";

const PrivateRoute = ({ loggedIn, accountSetup, component, ...rest }) => (
  <Route
    {...rest}
    component={loggedIn ? (accountSetup ? component : Setup) : Landing}
  />
);

class App extends Component {
  componentDidMount() {
    if (this.props.location.pathname.includes("/profile/")) {
      let cruzid = this.props.location.pathname;
      cruzid = cruzid.replace("/profile/", "");
      
      this.props.fetchUser().then(_ => {
        this.props.fetchProfile(cruzid);
      });
    } else {
      this.props.fetchUser();
    }
  }

  render() {
    return this.props.loadState === 0 ? (
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
            <PrivateRoute
              exact
              path="/profile/:cruzid"
              component={Profile}
              loggedIn={this.props.auth}
              accountSetup={this.props.auth.isSetup}
            />
            <PrivateRoute
              exact
              path="/profile/:cruzid/edit"
              component={EditProfile}
              loggedIn={this.props.auth}
              accountSetup={this.props.auth.isSetup}
            />
            {/* <Route exact path="/studentForm" component={studentForm} /> */}
            <PrivateRoute
              exact
              path="/search_results"
              component={SearchResults}
              loggedIn={this.props.auth}
              accountSetup={this.props.auth.isSetup}
            />
            <PrivateRoute
              exact
              path="/post"
              component={ResearchPost}
              loggedIn={this.props.auth}
              accountSetup={this.props.auth.isSetup}
            />
            <PrivateRoute
              exact
              path="/applicants"
              component={Applicants}
              loggedIn={this.props.auth}
              accountSetup={this.props.auth.isSetup}
            />
            {/* This is how you would use a PrivateRoute */}
            {/* <PrivateRoute exact path="/about" component={About} loggedIn={this.props.auth} /> */}
            <Route component={PageNotFound} />
            {this.props.auth ? <></> : <Redirect from="/*" to="/" />}
          </Switch>
        </ErrorBoundary>
        <Route
          render={({ history }) => {
            // Auto-update service worker on route change
            history.listen(() => {
              if (window.swUpdate === true) {
                console.log("Reloading");
                window.location.reload();
              }
            });
            return null;
          }}
        />
      </>
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
