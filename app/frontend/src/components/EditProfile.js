import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

class EditProfile extends Component {
  state = {
    cruzid: this.props.auth.cruzid,
    name: "",
    major: "",
    bio: ""
  };

  changeName = event => {
    this.setState({ name: event.target.value });
  };

  changeMajor = event => {
    this.setState({ major: event.target.value });
  };

  changeBio = event => {
    this.setState({ bio: event.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    let newProfile = {
      cruzid: this.props.auth.cruzid,
      name: this.state.name,
      bio: this.state.bio
    };

    this.props.updateUser(newProfile);

    let newMajor = {
      cruzid: this.props.auth.cruzid,
      major: this.state.major
    };

    this.props.updateProfile(newMajor);

    this.props.history.go("./");
  };

  render() {
    return (
      <div>
        <br />
        <form onSubmit={this.onSubmit}>
          <div className="box">
            <h1>Display Name:</h1>
            <input
              required
              name="name"
              type="text"
              value={this.state.name}
              placeholder="Enter Name"
              onChange={e => this.changeName(e)}
            />
            <br />
            <br />
            <h3>Major:</h3>
            <input
              name="major"
              type="text"
              value={this.state.major}
              placeholder="Enter Major"
              onChange={e => this.changeMajor(e)}
            />
            <br />
            <br />
            <h4>Bio:</h4>
            <textarea
              required
              name="bio"
              type="text"
              rows="5"
              value={this.state.bio}
              placeholder="Enter Bio"
              onChange={e => this.changeBio(e)}
            />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

EditProfile = connect(
  mapStateToProps,
  actions
)(EditProfile);

export default EditProfile;
