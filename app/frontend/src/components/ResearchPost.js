import React, { Component } from "react";
import { connect } from "react-redux";
import profileImg from "../assets/profile.png";
import * as actions from "../actions";
import qs from "query-string";
import axios from 'axios';
import Spinner from './Spinner';

class ResearchPost extends Component {
  state = {
    post: null
  };

  async componentDidMount() {
    const args = qs.parse(this.props.location.search);
    const id = args.id ? args.id : "";

    let post = await axios.get("/api/research_posts/", {
      params: {
        id: id,
        fill: true
      }
    });

    this.state.post = post.data;
    this.forceUpdate();
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
    return  (this.state.post !== null ? (
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
              {this.state.post.title}
            </div>

            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.state.post.summary}
            </div>

            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.state.post.description}
            </div>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#17864F" }}>
              {this.state.post.owner.name}
            </div>
          </div>

          <div className="column" align="left">
            <div className="box">
              {this.state.post.department.name}
            </div>
          </div>
          {(!this.props.auth.isProfessor || (this.state.post.owner.cruzid === this.props.auth.cruzid)) ?
          (<button className="button is-success" onClick={() => this.handleSubmit()}>{this.props.auth.isProfessor ? "Check Applicants" : "Apply"}</button>) : ""}
        </section>
      </div>) : <Spinner fullPage />
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, actions)(ResearchPost);
