import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import axios from 'axios';
import * as actions from '../actions';
import Spinner from './Spinner';
import ApplicantCard from './ApplicantCard';

class Applicants extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      post: null,
    };
  }

  async componentDidMount() {
    // Pull id from url, of format /applicants?id=xxxxxx
    const args = qs.parse(this.props.location.search);
    const id = args.id ? args.id : '';

    // Find post with given id
    const post = await axios.get('/api/research_posts/', {
      params: {
        id,
        fill: true,
      },
    });

    this.setState({
      post: post.data
    });
  }

  formatApplicant() {
    // Pull student data out of applications
    const applicants = this.state.post.applicants.filter(applicant => applicant.student);

    // Return neatly formatted ApplicantCards
    return (
      <div className="flex-container">
        {applicants.map(applicant => (
          <ApplicantCard
            onSubmit={this.onSubmit}
            key={applicant._id}
            questions={this.state.post.questions}
            applicant={{
              id: applicant._id,
              status: applicant.status,
              student: applicant.student,
              cruzid: applicant.student.cruzid,
              ownerProfile: `/profile/${applicant.student.cruzid}`,
              responses: applicant.responses,
            }}
            postID={this.state.post._id}
            sendAccepted={this.props.sendAccepted}
            sendDeclined={this.props.sendDeclined}
            sendInterview={this.props.sendInterview}
          />
        ))}
      </div>
    );
  }

  onSubmit = (applicationID, accept) => {
    // Inform the backend of the change in application status
    axios.post('/api/apply', {
      id: applicationID,
      status: accept,
    });

    // Search for an applicant with the requested ID
    for (let i = 0; i < this.state.post.applicants.length; i++) {
      if (this.state.post.applicants[i]._id === applicationID) {
        const { post } = this.state;

        // Update the accepted/denied status on the frontend immediately
        // Waiting for the axios request to return successful could lead to non-responsive UI
        post.applicants[i].status = accept ? 'accepted' : 'denied';
        this.setState({
          post,
        });
      }
    }
  }

  render() {
    // Show a spinner while state.post === null
    if (this.state.post === null) {
      return <Spinner fullPage />;
    }

    // Only the post owner can view this page
    if (this.props.auth.cruzid !== this.state.post.owner.cruzid) {
      return <p>Permission denied</p>;
    }

    const data = this.state.post.applicants;

    // Special case for no applicants
    if (data === null || data.length === 0) {
      return (
        <div className="has-text-centered">
          <br />
          <br />
          No Applicants
        </div>
      );
    }

    // Return formatted applicant data
    return (
      <section className="section">
        <div className="App" />

        {this.formatApplicant()}

      </section>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(Applicants);
