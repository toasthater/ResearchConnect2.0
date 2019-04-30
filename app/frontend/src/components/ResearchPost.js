import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
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
      const val = await axios.post("/api/apply", { postID: args.id, applicant: this.props.auth._id });

      console.log(val);
      alert(val.data);
    }
  }

  handleDelete() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }

    axios.delete("/api/research_posts?id=" + this.state.post._id)
      .then(res => this.props.history.push("/"))
      .catch(err => {
        console.log(err);
        alert("Failed to delete post");
      });
  }

  handleEdit() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }

    this.props.savePost(this.state.post);
    this.props.history.push("/new");
  }

  handleClose() {
    console.log(this.state)
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }
    var post = this.state.post
    post.status = 'Closed'
    this.setState(post)
    var newPost = {
      _id: this.state.post._id,
      title: this.state.post.title,
      owner: this.state.post.owner.cruzid,
      cruzid: this.state.post.owner.cruzid,
      tags: this.state.post.tags,
      summary: this.state.post.summary,
      description: this.state.post.description,
      department: {
        value: this.state.post.department._id,
        label: this.state.post.department.name
      },
      status: this.state.post.status,
      deadline: this.state.post.deadline
    }
    axios.post("/api/research_posts?id=" + this.state.post._id, newPost)
  }

  handleOpen() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }
    var post = this.state.post
    post.status = 'Open'
    this.setState(post)
    var newPost = {
      _id: this.state.post._id,
      title: this.state.post.title,
      owner: this.state.post.cruzid,
      cruzid: this.state.post.cruzid,
      tags: this.state.post.tags,
      summary: this.state.post.summary,
      description: this.state.post.description,
      department: {
        value: this.state.post.department._id,
        label: this.state.post.department.name
      },
      status: this.state.post.status,
      deadline: this.state.post.deadline
    }
    axios.post("/api/research_posts?id=" + this.state.post._id, newPost)
  }

  render() {
    if (this.state.post !== null && this.state.post.title === undefined) {
      this.props.history.push("/");
      return "";
    }

    return (this.state.post !== null ? (
      <div className="hero">
        <section className="container" style={{ width: 768 }}>
          <div className="column" align="center">
            <div className="circle-img">
              <DepartmentImage type={this.state.post.department.type} />
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

            <div className="box" style={{ background: "#DDDDDD", display: "grid" }}>
              {this.state.post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))}
            </div>
          </div>

          <div className="column" align="center">
            <Link to={"/profile/" + this.state.post.owner.cruzid}>
              <div className="box has-text-link" style={{ background: "#DDDDDD" }}>
                {this.state.post.owner.name}
              </div>
            </Link>
          </div>

          <div className="box" style={{ background: "#DDDDDD", display: "grid" }}>
            <span className="status is-medium" align="center">{this.state.post.status}</span>

          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#DDDDDD" }}>
              {this.state.post.department.name}
            </div>
            <br />
            <div align="center">
              {(this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid)) ?
                (<button className="button is-success" onClick={() => this.handleSubmit()} style={{ marginRight: "1em" }}>Check Applicants</button>) : ""}
              {(!this.props.auth.isProfessor && (this.state.post.owner.cruzid !== this.props.auth.cruzid) && (this.state.post.status === 'Open')) ?
                (<button className="button is-success" onClick={() => this.handleSubmit()} style={{ marginRight: "1em" }}>Apply</button>) : ""}
              {(this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid)) ?
                (<button className="button is-danger" onClick={() => this.handleDelete()}>Delete</button>) : ""}
              {(this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid) && (this.state.post.status === 'Open')) ?
                (<button className="button is-warning" onClick={() => this.handleClose()} style={{ marginLeft: "1em" }}>Close</button>) : ""}
              {(this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid) && (this.state.post.status === 'Closed')) ?
                (<button className="button is-warning" onClick={() => this.handleOpen()} style={{ marginLeft: "1em" }}>Open</button>) : ""}
              {(this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid)) ?
                (<button className="button is-success" onClick={() => this.handleEdit()} style={{ marginLeft: "1em" }}>Edit</button>) : ""}
            </div>

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
