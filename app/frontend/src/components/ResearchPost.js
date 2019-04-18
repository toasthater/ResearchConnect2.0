import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'query-string';
import axios from 'axios';
import * as actions from '../actions';
import Spinner from './Spinner';
import DepartmentImage from './DepartmentImage';

class ResearchPost extends Component {
  state = {
    post: null,
  };

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

  async handleSubmit() {
    const { location, auth, history } = this.props;

    const args = qs.parse(location.search);
    if (auth.isProfessor) {
      history.push(`/applicants?id=${ args.id}`);
    } else {
      const val = await axios.post('/api/apply', { postID: args.id, applicant: auth._id });

      alert(val.data);
    }
  }

  handleDelete() {
    const { auth, history } = this.props;
    const { post } = this.state;

    if (!auth.isProfessor || !(auth.cruzid === post.owner.cruzid)) {
      return;
    }

    axios.delete(`/api/research_posts?id=${ post._id}`)
    .then(() => history.push('/'))
    .catch(() => {
      alert('Failed to delete post');
    });
  }

  handleEdit() {
    const { auth, history, savePost } = this.props;
    const { post } = this.state;

    if (!auth.isProfessor || !(auth.cruzid === post.owner.cruzid)) {
      return;
    }

    savePost(post);
    history.push('/new');
  }

  render() {
    const { auth, history } = this.props;
    const { post } = this.state;

    if (post !== null && post.title === undefined) {
      history.push('/');
      return '';
    }

    return (post !== null ? (
      <div className="hero">
        <section className="container" style={{ width: 768 }}>
          <div className="column" align="center">
            <div className="circle-img">
              <DepartmentImage type={post.department.type} />
            </div>

            <div className="box" style={{ background: '#DDDDDD' }}>
              <div className="is-title">{post.title}</div>
            </div>

            <div className="box" style={{ background: '#DDDDDD' }}>
              {post.summary}
            </div>

            <div className="box" style={{ background: '#DDDDDD' }}>
              {post.description}
            </div>

            <div className="box" style={{ background: '#DDDDDD', display: 'grid' }}>
              {post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))}
            </div>
          </div>

          <div className="column" align="center">
            <Link to={`/profile/${ post.owner.cruzid}`}>
              <div className="box" style={{ background: '#DDDDDD' }}>
                {post.owner.name}
              </div>
            </Link>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: '#DDDDDD' }}>
              {post.department.name}
            </div>
            <br />
            <div align="center">
              {(!auth.isProfessor || (post.owner.cruzid === auth.cruzid))
                ? (<button type="button" className="button is-success" onClick={() => this.handleSubmit()} style={{ marginRight: '1em' }}>{auth.isProfessor ? 'Check Applicants' : 'Apply'}</button>) : ''}
              {(auth.isProfessor && (post.owner.cruzid === auth.cruzid))
                ? (<button type="button" className="button is-success" onClick={() => this.handleDelete()}>Delete</button>) : ''}
              {(auth.isProfessor && (post.owner.cruzid === auth.cruzid))
                ? (<button type="button" className="button is-success" onClick={() => this.handleEdit()} style={{ marginLeft: '1em' }}>Edit</button>) : ''}
            </div>
          </div>
        </section>
      </div>
      ) : <Spinner fullPage />
    );
  }
}

ResearchPost.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object,
  }),
  auth: PropTypes.shape({
    googleId: PropTypes.string,
    email: PropTypes.string,
    cruzid: PropTypes.string,
    isProfessor: PropTypes.bool,
    isSetup: PropTypes.bool,
    name: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  savePost: PropTypes.func.isRequired,
};

ResearchPost.defaultProps = {
  location: null,
  auth: null,
  history: null,
};

const mapStateToProps = state => ({
    auth: state.auth,
  });

export default connect(mapStateToProps, actions)(ResearchPost);
