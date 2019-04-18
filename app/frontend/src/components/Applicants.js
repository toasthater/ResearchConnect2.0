import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'query-string';
import axios from 'axios';
import * as actions from '../actions';
import Spinner from './Spinner';

class Applicants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
    };
  }

  async componentDidMount() {
    const { location } = this.props;

    const args = qs.parse(location.search);
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

  onSubmit(applicationID, accept) {
    axios.post('/api/apply', {
      id: applicationID,
      status: accept,
    });

    const { post } = this.state;

    for (let i = 0; i < post.applicants.length; i += 1) {
      if (post.applicants[i]._id === applicationID) {
        post.applicants[i].status = accept ? 'accepted' : 'denied';
        this.setState({
          post,
        });
      }
    }

    this.forceUpdate();
  }

  render() {
    const { post, auth } = this.state;

    if (post !== null) {
      if (auth.cruzid !== post.owner.cruzid) {
        return <p>Permission denied</p>;
      }

      const data = post.applicants;

      if (data === null || data.length === 0) {
        return (
          <div className="has-text-centered">
            <br />
            <br />
            No Applicants
          </div>
        );
      }

      const listItems = data.map((d) => {
        if (d.status === 'pending') {
          return (
            <li key={d.student.cruzid}>
              <Link className="link" to={`/profile/${d.student.cruzid}`}>{d.student.cruzid}</Link>
              <br />
              <button type="button" className="accept" onClick={() => this.onSubmit(d._id, true)}>Accept</button>
              <br />
              <button type="button" className="decline" onClick={() => this.onSubmit(d._id, false)}>Decline</button>
            </li>
          );
        }
        return (
          <li key={d.student.cruzid}>
            <Link className="link" to={`/profile/${d.student.cruzid}`}>{`${d.student.cruzid} - ${d.status}`}</Link>
          </li>
        );
      });

      return (
        <div>
          {listItems}
        </div>
      );
    }
    return <Spinner fullPage />;
  }
}

Applicants.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object,
  }),
};

Applicants.defaultProps = {
  location: null,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(Applicants);
