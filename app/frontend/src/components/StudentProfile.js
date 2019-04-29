import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import profileImg from '../assets/profile.png';
import ResumeForm from './ResumeForm';
import Spinner from './Spinner';

class StudentProfile extends Component {
  componentDidMount() {
    this.checkFollowers();
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isFollowDisabled: this.props.isFollowDisabled,
    };
  }

  checkFollowers = () => {
    axios
      .get('/api/users/', {
        params: {
          cruzid: this.props.auth.cruzid,
        },
      })
      .then((res) => {
        if (res.data.following && res.data.following.includes(this.props.match.params.cruzid)) {
          this.setState({
            following: true,
            loading: false,
          });
        } else {
          this.setState({
            following: false,
            loading: false,
          });
        }
      });
  }

  toggleFollow = (_) => {
    const following = this.state.following;
    this.setState({ isFollowDisabled: false });
    this.setState({ following: !this.state.following });

    axios
      .post('/api/follow', {
        cruzid: this.props.match.params.cruzid,
        following,
      })
      .then(_ => this.setState({ isFollowDisabled: false }))
      .catch((error) => {
        console.log(error);
        this.setState({ following });
      });
  };

  uploadResume(resume) {
    this.props.uploadResume(resume);
  }

  render() {
    const myProfile = this.props.profile.cruzid === this.props.auth.cruzid;

    if (this.state.loading) {
      return <Spinner fullPage />;
    }

    return (
      <div id={this.props.profile.cruzid} className="container" style={{ width: 768 }}>
        <div className="column" align="center">
          <h1 align="center">
            <div align="center">
              <figure className="image is-128x128">
                <img
                  className="is-rounded"
                  src={
                    this.props.profile.profile_pic
                      ? this.props.profile.profile_pic
                      : profileImg
                  }
                  alt={this.props.profile.name}
                  width={200}
                />
              </figure>
            </div>
          </h1>

          {!myProfile && (
            <div>
              <br />
              <button
                id={this.props.profile.cruzid}
                className={`button is-link ${ this.state.following ? '' : 'is-inverted'}`}
                disabled={this.state.isFollowDisabled}
                onClick={this.toggleFollow}
              >
                {this.state.following ? 'Following' : 'Follow'}
              </button>
              <br />
            </div>
          )}

          <br />

          <div className="box">
            {this.props.profile.name ? this.props.profile.name : 'No Name Listed'}
          </div>

          <div className="box">
            {this.props.profile.email ? this.props.profile.email : 'No Email Listed'}
          </div>

          {<div className="box">
            {this.props.student.major ? this.props.student.major : 'No Major Listed'}
          </div>}

          <div className="box">
            <p align="left">Bio:</p>
            <p align="left">{this.props.profile.bio ? this.props.profile.bio : 'No Available Bio'}</p>
          </div>

          {myProfile && this.props.auth && (
            <div className="box">
              <div>
                <p>Upload Resume:</p>
                <ResumeForm
                  onSubmit={data => this.uploadResume(data.file)}
                />
              </div>
            </div>
          )}

          <div>
            <a
              href={this.props.resume}
              className="button is-info"
              target="_blank"
              rel="noopener noreferrer"
              download={`${this.props.profile.name }_Resume.pdf`}
              disabled={!this.props.resume}
            >
              {this.props.resume ? 'Download Resume' : 'No Resume Available'}
            </a>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(StudentProfile);
