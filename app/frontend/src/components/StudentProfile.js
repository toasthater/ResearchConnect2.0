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
      <div className="flex item inner content">
        {this.state.endorsements.map(endorser => (
          <Link key={endorser} className="subtitle is-6 has-text-link" to={"/profile/" + endorser}>{endorser}</Link>
        ))}
      </div>)
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
          
          {this.props.auth.isProfessor && (
            <div>
              <button
                className={`button is-link ${ this.endorsed() ? '' : 'is-inverted'}`}
                onClick={() => this.setEndorsed(!this.endorsed())}
              >
                {this.endorsed() ? 'Endorsed' : 'Endorse'}
              </button>
              <br />
              <button
                className='button is-link'
                onClick={() => this.setState({ showEndorsements: !this.state.showEndorsements })}
                disabled={!this.state.endorsements || this.state.endorsements.length == 0}
              >
                {'Endorsed by ' + (this.state.endorsements ? this.state.endorsements.length : 0) + ' professors'}
              </button>
              <br />
              <br />
            </div>
          )}

          <br />
          
          {this.state.showEndorsements &&
          <div>
            {this.getEndorsers()}
            <br />
          </div>}

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
