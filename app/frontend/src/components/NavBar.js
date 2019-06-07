import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import brandingImg from '../assets/logo.svg';
import signinButton from '../assets/google_signin_blue.png';
import * as actions from '../actions';

import SearchBar from './SearchBar';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class NavBar extends Component {
  state = {
    open: false,
    showAdminModal: false,
    showBugModal: false,
    adminRequestText: "",
    bugReportText: ""
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

  toggle = () => { this.setState({ open: !this.state.open }) };
  close = () => { this.setState({ open: false }) };

  openAdminModal = () => {
    this.setState({ showAdminModal: true });
  }

  closeAdminModal = () => {
    this.setState({ showAdminModal: false });
  }

  openBugModal = () => {
    this.setState({ showBugModal: true });
  }

  closeBugModal = () => {
    this.setState({ showBugModal: false });
  }

  requestAdminAccess() {
    if (typeof (window) !== 'undefined') {
      Modal.setAppElement('body')
    }

    this.setState({
      showAdminModal: true
    })
  }

  reportBugs() {
    if (typeof (window) !== 'undefined') {
      Modal.setAppElement('body')
    }

    this.setState({
      showBugModal: true
    })
  }


  handleSubmitAdminRequest() {
    var message = this.state.adminRequestText;

    this.setState({
      showAdminModal: false
    });

    this.props.sendAdminRequest(message);
  }

  handleSubmitBugReport() {
    var message = this.state.bugReportText;

    this.setState({
      showBugModal: false
    })

    this.props.sendBugReport(message);
  }

  handleRequestReasonText(e) {

    this.setState({
      adminRequestText: e.target.value
    });
  }

  handleBugReportText(e) {

    this.setState({
      bugReportText: e.target.value
    });
  }

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
            <NavLink className="navbar-link" to={`/profile/${this.props.auth.cruzid}`}>
              {this.props.auth.name}
            </NavLink>
            <div className="navbar-dropdown is-right is-boxed">
              <Link className="navbar-item" to={`/profile/${this.props.auth.cruzid}`}>
                Profile
                </Link>
              <Link className="navbar-item" to="/settings">
                Settings
                </Link>
              <a className="navbar-item link-label" href={'#' + this.props.match.url} onClick={() => this.requestAdminAccess()}>
                Request admin access
              </a>

              <a className="navbar-item" href={'#' + this.props.match.url} onClick={() => this.reportBugs()}>
                Report a bug
              </a>
              <hr className="navbar-divider" />
              <a className="navbar-item" href="/api/logout">
                Logout
                </a>
            </div>

            <Modal isOpen={this.state.showAdminModal} contentLabel="adminRequest" style={customStyles} >
              <div className="adminRequestForm" /*onSubmit={() => this.handleSubmitAdminRequest()*/>
                <a align="center" href={'#' + this.props.match.url} >Provide your reason for requesting admin access:</a>
                <br /><br />
                <textarea align="center" cols="50" rows="10" type='text' onChange={(e) => this.handleRequestReasonText(e)} />
                <br /><br />
                <div align="center">
                  <button type="button" onClick={() => this.handleSubmitAdminRequest()} className="button is-warning is-link">Accept</button>
                  &nbsp;&nbsp;
                  <button type="button" onClick={() => this.closeAdminModal()} className="button is-warning is-link">Close</button>
                </div>
              </div>
            </Modal>

            <Modal isOpen={this.state.showBugModal} contentLabel="bugReport" style={customStyles} >
              <div className="bugReportForm" /*onSubmit={() => this.handleSubmitAdminRequest()*/>
                <a align="center" href={'#' + this.props.match.url} >Please provide a brief description of the bug:</a>
                <br /><br />
                <textarea align="center" cols="50" rows="10" type='text' onChange={(e) => this.handleBugReportText(e)} />
                <br /><br />
                <div align="center">
                  <button type="button" onClick={() => this.handleSubmitBugReport()} className="button is-warning is-link">Accept</button>
                  &nbsp;&nbsp;
                  <button type="button" onClick={() => this.closeBugModal()} className="button is-warning is-link">Close</button>
                </div>
              </div>
            </Modal>

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
