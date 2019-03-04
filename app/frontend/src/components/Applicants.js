import React, { Component } from "react";
import { connect } from "react-redux";
import profileImg from "../assets/profile.png";
import * as actions from "../actions";
import qs from "query-string";
import axios from 'axios';

class Applicants extends Component {
  componentDidMount() {
    this.props.fetchFacultyMember(this.props.auth.cruzid);

    const args = qs.parse(this.props.location.search);
    const id = args.id ? args.id : "";
    this.props.fetchPost(id, false);
  }

  async handleSubmit(e) {
    
  }
  
  render() {
    if (this.props.profile != null && this.props.post != null && this.props.profile._id == this.props.post.owner) {
        return <div>{this.props.post.applicants}</div>;
    }

    return this.props.profile == null ? <div>No Applicants</div> : (
        <div>Applicants: {this.props.profile.cruzid}</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.profile,
    post: state.post
  };
}

export default connect(mapStateToProps, actions)(Applicants);
