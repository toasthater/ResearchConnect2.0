import React, { Component } from "react";
import { connect } from "react-redux";
import profileImg from "../assets/profile.png";
import * as actions from "../actions";
import qs from "query-string";
import axios from 'axios';

class ResearchPost extends Component {
  async componentDidMount() {
    if (this.props.post === null) {
      this.getPost();
    } else {
      await this.props.fetchFacultyMemberByID(this.props.post.owner);
      await this.props.fetchDepartment(this.props.post.department);
      this.forceUpdate();
    }
  }
  
  getPost() {
    const args = qs.parse(this.props.location.search);
    const id = args.id ? args.id : "";
    this.props.fetchPost(id).catch(err => {
      console.log(err);
    });
  }

  async handleSubmit(e) {
    const args = qs.parse(this.props.location.search);
    if (this.props.auth.isProfessor) {
      this.props.history.push('/applicants?id=' + args.id);
    } else {
      const val = await axios.post("/api/apply", { postID:  args.id, applicant: this.props.auth._id });

      console.log(val);
      alert(val.data);
    }
  }
  
  render() {
    return ((this.props.post !== null && this.props.profile !== null && this.props.department !== null && this.props.department.department != null) ? (
      <div className="hero is-light">
        <section className="container" style={{ width: 768 }}>
          <h1 align="center">
            <br />
            <img src={profileImg} alt="ResearchConnect" width={200} />
            <br />
            <br />
          </h1>

          <div className="column" align="center">
            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.props.post.title}
            </div>

            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.props.post.description}
            </div>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#17864F" }}>
              {this.props.profile.name}
            </div>
          </div>

          <div className="column" align="left">
            <div className="box">
              {this.props.department.department.name}
            </div>
          </div>
          <button className="button is-success" onClick={() => this.handleSubmit()}>{this.props.auth.isProfessor ? "Check Applicants" : "Apply"}</button>
        </section>
      </div>) : ""
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile,
    auth: state.auth,
    post: state.post,
    department: state.department
  };
}

export default connect(mapStateToProps, actions)(ResearchPost);
