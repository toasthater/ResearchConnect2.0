import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

class EditProfile extends Component {
  state = {
    cruzid: this.props.auth.cruzid,
    name: "",
    email: "",
    major: "",
    bio: ""
  };

  changeName = event => {
    this.setState({ name: event.target.value });
  };

  changeEmail = event => {
    this.setState({ email: event.target.value });
  };

  changeMajor = event => {
    this.setState({ major: event.target.value });
  };

  changeBio = event => {
    this.setState({ bio: event.target.value });
  };

  handleSubmit(event) {
    alert(
      "An update was submitted: " + this.state.name + " and " + this.state.email
    );
    event.preventDefault();
  }

  onSubmit = e => {
    e.preventDefault();

    let newProfile = {
      cruzid: this.props.auth.cruzid,
      name: this.state.name,
      email: this.state.email,
      major: this.state.major,
      bio: this.state.bio
    };

    this.props.updateProfile(newProfile);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="box">
          <h1>Name:</h1>
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
          <h2>Email:</h2>
          <input
            name="email"
            type="text"
            value={this.state.email}
            placeholder="Enter Email"
            onChange={e => this.changeEmail(e)}
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
          <br />
          <br />
          Name: {this.state.name}
          <br />
          Email: {this.state.email}
          <br />
          Major: {this.state.major}
          <br />
          Bio: {this.state.bio}
        </div>
      </form>
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
