import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import brandingImg from '../assets/logo.svg';
import signinButton from '../assets/google_signin_blue.png';
import * as actions from '../actions';

import SearchBar from './SearchBar';

class NavBar extends Component {
    state = {
        open: false,
    }

    async submitSearch(values) {
      const type = values.type ? values.type : 'Default';
      const { query } = values;

      if (type && query) {
        await this.props.searchPosts(type, query)
        .then((_) => {
          this.props.history.push('/search_results');
        });
      }
    }

    toggle = () => {this.setState({ open: !this.state.open })};
    close = () => {this.setState({ open: false })};

    renderLoginButton() {
      switch (this.props.auth) {
        case null:
          return;
        case false:
          return (
            <></>
            );
        default:
          return (
            <div className="navbar-item has-dropdown is-hoverable">
              <NavLink className="navbar-link" to={`/profile/${ this.props.auth.cruzid}`}>
                {this.props.auth.name}
              </NavLink>
              <div className="navbar-dropdown is-right is-boxed">
                <Link className="navbar-item" to={`/profile/${ this.props.auth.cruzid}`}>
                  Profile
                </Link>
                <Link className="navbar-item" to="/settings">
                  Settings
                </Link>
                <hr className="navbar-divider" />
                <a className="navbar-item" href="/api/logout">
                  Logout
                </a>
              </div>
            </div>
          );
      }
    }

    render() {
        const { open } = this.state;

        return (
          <nav className={`navbar has-shadow is-spaced ${!this.props.auth ? 'is-white' : 'is-primary'}`}>
            <div className="container">
              <div className="navbar-brand">
                <Link className="navbar-item " to="/">
                  <img src={brandingImg} alt="Logo" />
                  &nbsp;&nbsp;
                  <strong>ResearchConnect</strong>
                </Link>
                <div
                  className={`navbar-burger burger ${open ? 'is-active' : ''}`}
                  onClick={this.toggle}
                  role="button"
                  tabIndex="0"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className={`navbar-menu ${open ? 'is-active' : ''}`}>
                <div className="navbar-start" />
                {this.props.auth && this.props.auth.isSetup && <SearchBar onSubmit={(values) => { this.submitSearch(values); }} />}
                <div className="navbar-end">
                  {!this.props.auth && (<div className="navbar-item">
                    <a href="/auth/google" className="has-text-centered">
                      <button
                        style={{
                        background: `url("${signinButton}")`, backgroundSize: 'cover', width: 196, height: 46, border: 'none', display: 'inline-block'
                      }}
                        className="button"
                        onClick={this.signIn}
                        title="Sign In"
                      />
                    </a>
                  </div>)}
                  {this.props.auth && this.props.auth.isProfessor && (
                    <NavLink className="navbar-item" to="/new" onClick={this.close}>
                      New Research
                    </NavLink>
                  )}
                  <div className="navbar-item">
                    {this.renderLoginButton()}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        );
}
}

function mapStateToProps({ auth, search }) {
  return { auth, search };
}

export default withRouter(connect(mapStateToProps, actions)(NavBar));
