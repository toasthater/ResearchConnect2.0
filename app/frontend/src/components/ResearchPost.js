import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import qs from "query-string";
import axios from 'axios';
import Spinner from './Spinner';
import DepartmentImage from './DepartmentImage';

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
    if (this.state.post !== null && this.state.post.title === undefined) {
      this.props.history.push("/");
      return "";
    }

    return  (this.state.post !== null ? (
      <div className="hero">
        <section className="container" style={{ width: 768 }}>
          <div className="column" align="center">
            <div className="circle-img">
                <DepartmentImage  type={this.state.post.department.type}/>
            </div>
            
            <div className="box" style={{ background: "#DDDDDD" }}>
              <div className="is-title">{this.state.post.title}</div>
            </div>

            <div className="box" style={{ background: "#DDDDDD" }}>
              {this.state.post.summary}
            </div>

            <div className="box" style={{ background: "#DDDDDD" }}>
              {this.state.post.description}
            </div>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#DDDDDD" }}>
              {this.state.post.owner.name}
            </div>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#DDDDDD" }}>
              {this.state.post.department.name}
            </div>
            <br />
            {(!this.props.auth.isProfessor || (this.state.post.owner.cruzid === this.props.auth.cruzid)) ?
          (<button className="button is-success" onClick={() => this.handleSubmit()}>{this.props.auth.isProfessor ? "Check Applicants" : "Apply"}</button>) : ""}
          </div>
          
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
