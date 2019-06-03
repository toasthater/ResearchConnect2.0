import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'query-string';
import axios from 'axios';
import * as actions from '../actions';
import Spinner from './Spinner';
import DepartmentImage from './DepartmentImage';
import Modal from './Modal';

const md = require('markdown-it')({
  breaks: true
});

// Modal.defaultStyles.overlay.top = "5%";
// Modal.defaultStyles.content.background = "#efebeb";

class ResearchPost extends Component {
  state = {
    post: null,
    showModal: false,
    hasApplied: false,
    responses: []
  };

  async componentDidMount() {
    let id;
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      id = this.props.match.params.id;
    } else {
      const args = qs.parse(this.props.location.search);
      id = args.id ? args.id : '';
    }

    const post = await axios.get('/api/research_posts/', {
      params: {
        id,
        fill: true,
      },
    });

    if (!post.data.questions) {
      post.data.questions = [];
    }

    let applied = await axios.get("/api/hasApplied?id=" + id);

    let responses = [];
    for (let i = 0; i < post.data.questions.length; i += 1) {
      responses[i] = "";
    }

    this.setState({
      post: post.data,
      hasApplied: applied.data,
      responses: responses
    });

    // var currentDate = new Date()
    // var postDate = new Date(post.data.deadline)
    // if (post.data.status === 'Open' && currentDate > postDate) {
    //   console.log("closed the post (past deadline)")
    //   const post = this.state.post;
    //   post.status = 'Closed';
    //   this.setState(post);
    //   const newPost = {
    //     _id: this.state.post._id,
    //     title: this.state.post.title,
    //     owner: this.state.post.owner.cruzid,
    //     cruzid: this.state.post.owner.cruzid,
    //     tags: this.state.post.tags,
    //     summary: this.state.post.summary,
    //     description: this.state.post.description,
    //     department: {
    //       value: this.state.post.department._id,
    //       label: this.state.post.department.name,
    //     },
    //     status: this.state.post.status,
    //     deadline: this.state.post.deadline,
    //   };
    //   axios.post(`/api/research_posts?id=${this.state.post._id}`, newPost);
    // }

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
      this.props.sendApplied(args.id, this.state.post.cruzid);
    } else {
      this.setState({ showModal: true });
    }
  }

  handleDelete() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }

    axios.delete(`/api/research_posts?id=${this.state.post._id}`)
      .then(res => this.props.history.push('/'))
      .catch((err) => {
        console.log(err);
        alert('Failed to delete post');
      });
  }

  handleEdit() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }

    this.props.savePost(this.state.post);
    this.props.history.push('/new');
  }

  handleClose() {
    console.log(this.state);
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }
    const post = this.state.post;
    post.status = 'Closed';
    this.setState(post);
    const newPost = {
      _id: this.state.post._id,
      title: this.state.post.title,
      owner: this.state.post.owner.cruzid,
      cruzid: this.state.post.owner.cruzid,
      tags: this.state.post.tags,
      reqSkills: this.state.post.reqSkills,
      prefSkills: this.state.post.prefSkills,
      summary: this.state.post.summary,
      description: this.state.post.description,
      department: {
        value: this.state.post.department._id,
        label: this.state.post.department.name,
      },
      status: this.state.post.status,
      deadline: this.state.post.deadline,
    };
    axios.post(`/api/research_posts?id=${this.state.post._id}`, newPost);
  }

  handleOpen() {
    if (!this.props.auth.isProfessor || !(this.props.auth.cruzid === this.state.post.owner.cruzid)) {
      return;
    }
    const post = this.state.post;
    post.status = 'Open';
    this.setState(post);
    const newPost = {
      _id: this.state.post._id,
      title: this.state.post.title,
      owner: this.state.post.cruzid,
      cruzid: this.state.post.cruzid,
      tags: this.state.post.tags,
      reqSkills: this.state.post.reqSkills,
      prefSkills: this.state.post.prefSkills,
      summary: this.state.post.summary,
      description: this.state.post.description,
      department: {
        value: this.state.post.department._id,
        label: this.state.post.department.name,
      },
      status: this.state.post.status,
      deadline: this.state.post.deadline,
    };
    axios.post(`/api/research_posts?id=${this.state.post._id}`, newPost);
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
      this.props.history.push('/');
      return '';
    }

    return (this.state.post !== null ? (
      <div className="section">
        <section className="container">
          <div className="columns">
            <div className="column is-half is-offset-one-quarter" align="center">
              <div className="circle-img">
                <DepartmentImage type={this.state.post.department.type} />
              </div>

              <br />

              <h1 className="title" style={{ marginBottom: '0px' }}>{this.state.post.title}</h1>
              <Link to={`/profile/${this.state.post.owner.cruzid}`}>
                <a className="subtitle">by {this.state.post.owner.name}</a>
              </Link>
              <br /><br />
              <div class="tags" style={{ display: 'flex', justifyContent: 'center' }}>
                {this.state.post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))}
              </div>

              <hr />

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Department</h2>
                <h1 className="title is-5">{this.state.post.department.name}</h1>
              </div>

              {/* <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Summary</h2>
                <h1 className="title is-5">{this.state.post.summary}</h1>
              </div> */}

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Description</h2>
                {console.log(this.state.post.description)}
                <h1 className="title is-5">
                  <div dangerouslySetInnerHTML={{ __html: md.render(this.state.post.description) }} />
                </h1>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Required Skills</h2>
                <div className="tags" style={{ display: 'flex', justifyContent: 'center' }}>
                  {this.state.post.reqSkills.map(skill => (<span className="tag is-medium" key={skill}>{skill}</span>))}
                </div>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Preferred Skills</h2>
                <div className="tags" style={{ display: 'flex', justifyContent: 'center' }}>
                  {this.state.post.prefSkills.map(skill => (<span className="tag is-medium" key={skill}>{skill}</span>))}
                </div>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Status</h2>
                <h1 className="title is-5">{this.state.post.status}</h1>
              </div>
            </div>
          </div>
          <div className="column" align="center">
            <br />
            <div align="center">
              {this.props.auth.isProfessor && this.state.post.owner.cruzid === this.props.auth.cruzid &&
                <button className="button is-success" onClick={() => this.goToApplicants()} style={{ marginLeft: "1em" }}>Applicants</button>}

              {!this.props.auth.isProfessor && !this.state.hasApplied && this.state.post.status === 'Open' &&
                <button className="button is-success" onClick={() => this.applyToPost()} style={{ marginLeft: "1em" }}>Apply</button>}

              {!this.props.auth.isProfessor && this.state.hasApplied && this.state.post.status === 'Open' &&
                <button className="button is-success" disabled onClick={() => this.applyToPost()} style={{ marginLeft: "1em" }}>Applied</button>}

              {this.props.auth.isProfessor && this.state.post.owner.cruzid === this.props.auth.cruzid && this.state.post.status === 'Open' &&
                <button className="button is-warning" onClick={() => this.handleClose()} style={{ marginLeft: "1em" }}>Close</button>}

              {this.props.auth.isProfessor && this.state.post.owner.cruzid === this.props.auth.cruzid && this.state.post.status === 'Closed' &&
                <button className="button is-warning" onClick={() => this.handleOpen()} style={{ marginLeft: "1em" }}>Open</button>}

              {this.props.auth.isProfessor && (this.state.post.owner.cruzid === this.props.auth.cruzid) &&
                <button className="button is-danger" onClick={() => this.handleDelete()} style={{ marginLeft: "1em" }}>Delete</button>}

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
      </div>
    ) : <Spinner fullPage />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(ResearchPost);
