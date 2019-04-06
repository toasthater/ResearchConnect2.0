import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';

class StudentProfile extends PureComponent {
  render() {
    const post = this.props.post;
    return (
      <div key={post.id} className="flex-item">
        <p className="box">{post.name}</p>
      </div>)
  }
}

export default withRouter(StudentProfile);