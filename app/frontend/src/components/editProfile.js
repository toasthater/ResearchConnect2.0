import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

class editProfile extends Component {
  handleEdit = e => {
    e.preventDefault();
    const newUsername = this.getUsername.value;
    const newEmail = this.getEmail.value;
    const data = {
      cruzid: this.props.auth.cruzid,
      name: newUsername,
      email: newEmail
    };

    this.send(data);

    this.props.updateProfile(data);

    /*this.props.dispatch({
      type: "UPDATE_PROFILE",
      _id: this.props.auth.id,
      data: data
    });*/
  };

  render() {
    return (
      <div className="box">
        <form onSubmit={this.handleEdit}>
          <input
            required
            type="text"
            ref={input => (this.getUsername = input)}
            defaultValue={this.props.auth.name}
            placeholder="Enter Name"
          />
          <br />
          <br />
          <textarea
            required
            ref={input => (this.getEmail = input)}
            defaultValue={this.props.auth.email}
            cols="28"
            placeholder="Enter Email"
          />
          <br />
          <br />
          <button onClick={() => this.props.handleEdit()}>Edit</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

editProfile = connect(
  mapStateToProps,
  actions
)(editProfile);

export default editProfile;
