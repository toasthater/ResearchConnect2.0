import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import profileImg from '../assets/profile.png';

class UserCard extends PureComponent {
  render() {
    const { user } = this.props;
    return (
      <div key={user.id} className="card" style={{ borderRadius: '5px', marginBottom: '2.5em' }}>
        <div className="card-image has-text-centered" style={{ top: '-1em' }}>
          <figure className="image is-128x128" style={{ display: 'inline-block' }}>
            <img src={user.profile_pic ? user.profile_pic : profileImg} alt="" className="post-icon" style={{maxHeight: "128px", maxWidth: "128px"}} />
          </figure>
        </div>
        <div className="card-content" style={{ paddingTop: '0px' }}>
          <p className="title is-4">{ user.name }</p>
          <p className="subtitle is-6">
            { user.isAdmin ? "Admin" : user.isProfessor ? "Professor" : "Student" }
          </p>
          <div className="content">
            { user.bio ? user.bio : "No bio defined" }
          </div>
        </div>
        <footer className="card-footer">
          <Link className="card-footer-item has-text-success" to={`/profile/${user.cruzid}`}>
            Visit Profile
          </Link>
        </footer>
      </div>
    );
  }
}

export default withRouter(UserCard);
