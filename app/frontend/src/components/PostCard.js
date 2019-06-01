import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import DepartmentImage from './DepartmentImage';


class PostCard extends PureComponent {

  getApplicants() {
    var applicants = this.props.post.applicants;
    return (
      <div className="flex item inner content">
        {applicants.map(applicant =>
          <div key={applicant}>
            <Link className="subtitle is-6 has-text-link" to={"/profile/" + applicant}>{applicant}</Link>
            <br />
          </div>)}
      </div>
    );
  }

  render() {
    const { post } = this.props;
    return (
      <div key={post.id} className="card" style={{ borderRadius: '5px', marginBottom: '2.5em' }}>
        <div className="card-image has-text-centered" style={{ top: '-1em' }}>
          <figure className="image is-128x128" style={{ display: 'inline-block' }}>
            <DepartmentImage type={post.type} />
          </figure>
        </div>
        <div className="card-content" style={{ paddingTop: '0px' }}>
          <p className="title is-4">{post.name}</p>
          <p className="subtitle is-6">
            by <Link className="has-text-link" to={post.ownerProfile}>{post.professor}</Link>
          </p>
          <div className="content">
            {post.summary}
          </div>
          <p className="subtitle is-6">
            Start Date: <a className="has-text-link">{(post.date.getMonth() + 1) + '/' + post.date.getDate() + '/' + post.date.getFullYear()} </a>
          </p>
          <div className="tag is-info" style={{ margin: '0.25em 0px' }}>{post.department}</div>
        </div>

        <footer className="card-footer">
          <Link className="card-footer-item has-text-success" to={`/post?id=${post.id}`}>
            Learn More
          </Link>
        </footer>
      </div>
    );
  }
}

export default withRouter(PostCard);
