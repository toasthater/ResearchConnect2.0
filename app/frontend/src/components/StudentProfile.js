import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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
      endorsements: this.props.student.endorsements,
      showEndorsements: false,
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

  endorsed() {
    return this.state.endorsements && this.state.endorsements.includes(this.props.auth.cruzid);
  }

  setEndorsed(val) {
    var { endorsements } = this.state;
    if (!endorsements) {
      endorsements = [];
    }

    var request = null;

    if (val && !this.endorsed()) {
      request = {
        id: this.props.student.id,
        endorse: true,
      };

      endorsements.push(this.props.auth.cruzid);
    } else if (!val && this.endorsed()) {
      request = {
        id: this.props.student.id,
        endorse: false,
      };

      endorsements = endorsements.filter(value => value !== this.props.auth.cruzid);
    }

    if (request) {
      axios.post('/api/endorse', request).then().catch(err => {
        console.log(err);
      });

      this.setState({
        endorsements: endorsements,
      });
    }
  }

  getEndorsers() {
    return (
      <table class="table is-bordered">
        <tbody>
          {this.state.endorsements.map(endorser => (
            <tr><td><Link key={endorser} className="subtitle is-6 has-text-link" to={"/profile/" + endorser}>{endorser}</Link></td></tr>
          ))}
        </tbody>
        <br />
      </table>)
  }

  render() {
    const myProfile = this.props.profile.cruzid === this.props.auth.cruzid;

    if (this.state.loading) {
      return <Spinner fullPage />;
    }

    return (
      <div id={this.props.profile.cruzid} className="container">
        <div className="columns">
          <div className="column is-half is-offset-3">
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
                    />
                  </figure>
                </div>
              </h1>

              <hr />

              {this.props.auth.isProfessor && (
                <div className="columns">
                  <div className="column is-one-third">
                    <button
                      className={`button is-fullwidth ${this.endorsed() ? 'is-danger is-outlined' : 'is-link'}`}
                      onClick={() => this.setEndorsed(!this.endorsed())}
                    >
                      {this.endorsed() ? 'Unendorse' : 'Endorse'}
                    </button>
                  </div>
                  <div className="column">
                    <button
                      className='button is-link is-fullwidth is-outlined'
                      onClick={() => this.setState({ showEndorsements: !this.state.showEndorsements })}
                      disabled={!this.state.endorsements || this.state.endorsements.length == 0}
                    >
                      {'Endorsed by ' + (this.state.endorsements ? this.state.endorsements.length : 0) + ' professors'}
                    </button>
                  </div>
                </div>
              )}

              {this.state.showEndorsements &&
                <div>
                  {this.getEndorsers()}
                </div>}

              {!myProfile && (
                <div>
                  <button
                    id={this.props.profile.cruzid}
                    className={`button ${this.state.following ? 'is-link' : 'is-danger is-outlined'}`}
                    disabled={this.state.isFollowDisabled}
                    onClick={this.toggleFollow}
                  >
                    {this.state.following ? 'Following' : 'Unfollow'}
                  </button>
                  <br />
                </div>
              )}

              <br />

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Name</h2>
                <h1 className="title is-4">{this.props.profile.name ? this.props.profile.name : 'No Name Listed'}</h1>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Email</h2>
                <h1 className="title is-4">{this.props.profile.email ? this.props.profile.email : 'No Email Listed'}</h1>
              </div>

              {<div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Major</h2>
                <h1 className="title is-4">{this.props.student.major ? this.props.student.major : 'No Major Listed'}</h1>
              </div>}

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Bio</h2>
                <h1 className="title is-4">{this.props.profile.bio ? this.props.profile.bio : 'No Available Bio'}</h1>
              </div>

              {myProfile && this.props.auth && (
                <div className="box">
                  <div>
                    <h2 className="subtitle is-uppercase is-size-7" style={{ marginBottom: '0px' }}>Upload Resume</h2>
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
                  download={`${this.props.profile.name}_Resume.pdf`}
                  disabled={!this.props.resume}
                >
                  {this.props.resume ? 'Download Resume' : 'No Resume Available'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(StudentProfile);
