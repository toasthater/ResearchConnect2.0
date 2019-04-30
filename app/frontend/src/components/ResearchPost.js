import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import * as actions from "../actions";
import qs from "query-string";
import axios from 'axios';
import Spinner from './Spinner';
import DepartmentImage from './DepartmentImage';
import Modal from 'react-modal';

Modal.defaultStyles.overlay.top = "5%";
Modal.defaultStyles.content.background = "#efebeb";

class ResearchPost extends Component {
  state = {
    post: null,
    showModal: false,
    hasApplied: false,
    responses: []
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

    let applied = await axios.get("/api/hasApplied?id=" + id);

    let responses = [];
    for (let i = 0; i < post.data.questions.length; i += 1) {
      responses[i] = "";
    }

    this.setState({
      post: post.data,
      hasApplied: applied.data,
      responses: responses });
  }
  
  async goToApplicants() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }

    const args = qs.parse(this.props.location.search);
    this.props.history.push('/applicants?id=' + args.id);
  }

  async applyToPost() {
    if (this.props.auth.isProfessor) {
      return;
    }

    const args = qs.parse(this.props.location.search);

    if (!this.state.post.questions || this.state.post.questions.length === 0) {
      const val = await axios.post("/api/apply", { postID: args.id, applicant: this.props.auth._id });
      alert(val.data);
    } else {
      this.setState({showModal: true});
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

  editResponse = (e) => {
    e.persist();

    this.setState(state => {
      const responses = state.responses;
      responses[parseInt(e.target.name)] = e.target.value;

      return { responses };
    });
  }

  getQuestions = () => {
    let q = this.state.post.questions.map((question, i) =>
      <div key={"Question " + i} align="center" style={{ marginBottom: "1em" }}>
        <h1 className="subtitle">{"Question #" + (i + 1)}</h1>
        <p>{question}</p>
        <textarea name={i} className="textarea" placeholder={"Response to question #" + (i + 1)} value={this.state.responses[i]} onChange={e => this.editResponse(e)}></textarea>
      </div>
    );

    return <div>{q}</div>
  }

  async onSubmitModal() {
    for (let i = 0; i < this.state.responses.length; i += 1) {
      if (!this.state.responses[i] || this.state.responses[i] === "") {
        alert("All questions must be answered");
        return;
      }
    }

    const args = qs.parse(this.props.location.search);

    const val = await axios.post("/api/apply", {
      postID: args.id,
      applicant: this.props.auth._id,
      responses: this.state.responses
    });

    alert(val.data);
    this.setState({
      showModal: false
    });
  }

  onCancelModal = () => {
    this.setState({
      showModal: false
    });
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

            <div className="box" style={{ background: "#DDDDDD", display: "grid" }}>
            {this.state.post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))}
            </div>
          </div>

          <div className="column" align="center">
            <Link to={"/profile/" + this.state.post.owner.cruzid}>
              <div className="box" style={{ background: "#DDDDDD" }}>
                {this.state.post.owner.name}
              </div>
            </Link>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#DDDDDD"}}>
              {this.state.post.department.name}
            </div>
            <br />
            <div align="center">
              {this.props.auth.isProfessor && this.state.post.owner.cruzid === this.props.auth.cruzid &&
                <button className="button is-success" onClick={() => this.goToApplicants()} style={{ marginRight: "1em" }}>Check Applicants</button>}

              {!this.props.auth.isProfessor && !this.state.hasApplied &&
                <button className="button is-success" onClick={() => this.applyToPost()} style={{ marginRight: "1em" }}>Apply</button>}

              {this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid) && 
                <button className="button is-success" onClick={() => this.handleDelete()}>Delete</button>}

              {this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid) &&
                <button className="button is-success" onClick={() => this.handleEdit()} style={{ marginLeft: "1em" }}>Edit</button>}
              </div>
          </div>
          <Modal isOpen={this.state.showModal} contentLabel="Questionnaire">
            {this.getQuestions()}
            <div className="columns" align="center">
              <div className="column">
                <button onClick={() => this.onSubmitModal()} className="button is-link">Submit</button>
              </div>
              <div className="column"> 
                <button onClick={() => this.onCancelModal()} className="button is-danger is-link">Cancel</button>
              </div>
            </div>
          </Modal>
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
