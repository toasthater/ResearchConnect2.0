import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import brandingImg from '../assets/logo.svg';
import { connect } from 'react-redux';

class NavBar extends Component {
    state = {
        open: false
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
              <Link className="navbar-item" to="/account">
                Account
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
                <Link className="navbar-item " to={this.props.auth ? "/home" : "/"}>
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

function mapStateToProps({auth}){
  return { auth };
}

export default connect(mapStateToProps)(NavBar);

