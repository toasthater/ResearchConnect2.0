import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'query-string';
import axios from 'axios';
import * as actions from '../actions';
import Spinner from './Spinner';
import ApplicantCard from './ApplicantCard';

class Applicants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
    };
  }

  async componentDidMount() {
    const args = qs.parse(this.props.location.search);
    const id = args.id ? args.id : '';

    const post = await axios.get('/api/research_posts/', {
      params: {
        id,
        fill: true,
      },
    });

    this.state.post = post.data;
    this.forceUpdate();
  }

  formatApplicant() {
    const applicants = this.state.post.applicants;
    return (
      <div className="flex-container">
        {applicants.map(applicant => (
          <ApplicantCard
            onSubmit={this.onSubmit}
            key={applicant._id}
            applicant={{
          id: applicant._id,
          status: applicant.status,
          student: applicant.student,
          cruzid: applicant.student.cruzid,
          ownerProfile: `/profile/${ applicant.student.cruzid}`,
        }}
          />
))}
      </div>
);
  }

  onSubmit = (applicationID, accept) => {
    axios.post('/api/apply', {
      id: applicationID,
      status: accept,
    });
    for (let i = 0; i < this.state.post.applicants.length; i++) {
      if (this.state.post.applicants[i]._id === applicationID) {
        const { post } = this.state;
        post.applicants[i].status = accept ? 'accepted' : 'denied';
        this.setState({
          post,
        });
      }
    }
    this.forceUpdate();
  }

  render() {
    if (this.state.post !== null) {
      if (this.props.auth.cruzid !== this.state.post.owner.cruzid) {
        return <p>Permission denied</p>;
      }

      const data = this.state.post.applicants;

      if (data === null || data.length === 0) {
        return (
          <div className="has-text-centered">
            <br />
            <br />
No Applicants
          </div>
        );
      }


      return (
        <section className="section">
          <div className="App" />

          {this.formatApplicant()}

        </section>
      );
    }
    return <Spinner fullPage />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(Applicants);
