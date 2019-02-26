import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import brandingImg from '../assets/logo.svg';
import { connect } from 'react-redux';
import * as actions from '../actions';

import SearchBar from './SearchBar';

class NavBar extends Component {
    state = {
        open: false
    }

    async submitSearch(values) {
      const type = values.type ? values.type : "Default";
      const query = values.query;
      
      if (type && query)
      {
        await this.props.searchPosts(type, query)
        .then(_ => {
          this.props.history.push('/search_results');
        });
      }
    }

    toggle = () => this.setState({open: !this.state.isOpen});
    
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
              <NavLink className="navbar-link" to="/account">
                {this.props.auth.name}
              </NavLink>
              <div className="navbar-dropdown is-right is-boxed">
                <Link className="navbar-item" to="/profile">
                  Account
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

        return(
            <nav className={`navbar is-fixed-top ${!this.props.auth ? 'is-transparent' : 'is-link'}`}>
            <div className="container">
              <div className="navbar-brand">
                <Link className="navbar-item " to="/">
                  <img src={brandingImg} alt="Logo" />
                </Link>
                <div className={`navbar-burger burger ${open ? 'is-active' : ''}`}
                  onClick={this.toggle} role="button" tabIndex="0">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className={`navbar-menu ${open ? 'is-active' : ''}`}>
                <div className="navbar-start">
                  <NavLink className="navbar-item" to="/about">
                    About
                  </NavLink>
                </div>
                {this.props.auth && this.props.auth.isSetup && <SearchBar onSubmit={(values) => { this.submitSearch(values) }} />}
                <div className="navbar-end">
                    <div className="navbar-item">
                        {this.renderLoginButton()}
                    </div>
                </div>
              </div>
            </div>
          </nav>
        )}
}

function mapStateToProps({ auth, search }){
  return { auth, search };
}

export default withRouter(connect(mapStateToProps, actions)(NavBar));
