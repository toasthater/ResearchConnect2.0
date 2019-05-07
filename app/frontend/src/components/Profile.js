import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
 Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import * as actions from '../actions';

import Spinner from './Spinner';
import StudentProfile from './StudentProfile';
import ProfessorProfile from './ProfessorProfile';
import PostCard from './PostCard';

class Profile extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params.cruzid !== this.props.match.params.cruzid) {
      this.setProfileStates();
      this.setRelevantStates();
    }
  }

  constructor(props) {
    super(props);

    if (this.props.match.params.cruzid === this.props.auth.cruzid) {
      this.state = {
        cruzid: this.props.match.params.cruzid,
        profileLoaded: true,
        userLoaded: false,
        researchLoaded: false,
        profile: this.props.auth,
        research: [],
      };
    } else {
      this.state = {
        cruzid: this.props.match.params.cruzid,
        profileLoaded: false,
        userLoaded: false,
        researchLoaded: false,
        profile: null,
        isFollowDisabled: false,
        research: [],
      };
    }

    if (props.match.params.cruzid !== props.auth.cruzid) {
      this.setProfileStates();
      this.setRelevantStates();
    } else {
      this.setRelevantStates();
    }
  }

  setProfileStates = () => {
    // Fetch and set user specific data to local states
    axios
      .get('/api/users/', {
        params: {
          cruzid: this.props.match.params.cruzid,
        },
      })
      .then(response => this.setState({
          profileLoaded: true,
          profile: response.data,
          isFollowDisabled: false,
        }))
      .catch(error => console.log(error));
  }

  setRelevantStates = () => {
    // Fetch and set student/professor specific data to local states
    axios.get('/api/users/', {
      params: {
        cruzid: this.props.match.params.cruzid,
      },
    })
      .then((response) => {
        if (response.data.isProfessor === true) {
          console.log('Fetching Professor Profile...');

          axios.get('/api/faculty_members/', {
            params: {
              cruzid: this.props.match.params.cruzid,
            },
          })
            .then((response) => {
              this.setState({
                professor: response.data,
                isProfessor: true,
                userLoaded: true,
              });
            })
            .catch(error => console.log(error));

          axios
            .get('/api/search?type=cruzid&query=' + this.props.match.params.cruzid)
            .then(response => this.setState({
                research: response.data,
                researchLoaded: true,
              }))
            .catch(error => console.log(error));
        } else {
          console.log('Fetching Student Profile...');

          axios.get('/api/students/', {
            params: {
              cruzid: this.props.match.params.cruzid,
            },
          })
            .then((response) => {
              this.setState({
                student: response.data,
                isProfessor: false,
                userLoaded: true,
              });
            })
            .catch(error => console.log(error));

          axios.get('/api/search?type=Applicants&query=' + this.props.match.params.cruzid)
          .then(response => {
            this.setState({
              research: response.data,
              researchLoaded: true,
            })
          })
          .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
  }

  fetchResearchPosts = () => {
    const research_posts = this.state.research.map(research => (
      <div key={research._id} className="box">
        <h1 align="left">{`Title: ${ research.title}`}</h1>
        <br />
        <h2 align="left">{`Summary: ${ research.summary}`}</h2>
        <br />
        <Link className="card-footer-item info" to={`/post?id=${research._id}`}>Learn More</Link>
      </div>
    ));

    return (
      <ul>{research_posts}</ul>
    );
  }

  displayStudentProfile() {
    return (
      <StudentProfile
        id={this.state.profile.cruzid}
        auth={{ cruzid: this.props.auth.cruzid }}
        profile={this.state.profile}
        student={{ major: this.state.student.major }}
        resume={this.state.profile.resume}
        isFollowDisabled={this.state.isFollowDisabled}
        uploadResume={this.props.uploadResume}
      />
    );
  }

  displayProfessorProfile() {
    return (
      <ProfessorProfile
        id={this.state.profile.cruzid}
        auth={{ cruzid: this.props.auth.cruzid }}
        profile={this.state.profile}
        professor={this.state.professor}
        isFollowDisabled={this.state.isFollowDisabled}
      />
    );
  }

  formatPost(mod, eq) {
    const { research: posts } = this.state;
    return (
      <React.Fragment>
        {posts.filter((_, index) => (index % mod) === eq).map(post => (
          <PostCard
            key={post._id}
            post={{
              id: post._id,
              type: post.department.type,
              name: post.title,
              professor: post.owner.name,
              tags: post.tags,
              summary: post.summary,
              department: post.department.name,
              ownerProfile: "/profile/" + post.owner.cruzid,
              applicants: this.props.auth.isProfessor ? post.applicants.map(applicant => applicant.student ? applicant.student.cruzid : "") : null
            }}
          />
        ))}
      </React.Fragment>
    )
  }

  render() {
    if (!this.state.profileLoaded || !this.state.userLoaded) {
      return <Spinner fullPage />;
    }

    return (
      <section className="section">
        <div className="container has-text-centered">
          <Tabs>
            <TabList>
              {!this.state.isProfessor && <Tab>Student</Tab>}
              {this.state.isProfessor && <Tab>Professor</Tab>}
              <Tab>Projects</Tab>
            </TabList>

            <TabPanel>
              {!this.state.isProfessor && this.displayStudentProfile()}
              {this.state.isProfessor && this.displayProfessorProfile()}
            </TabPanel>

            <TabPanel>
              {this.state.researchLoaded ? (
                <div className="columns is-multiline" style={{ paddingTop: '1em' }}>
                  <div className="column is-one-third">
                    {this.formatPost(3, 0)}
                  </div>
                  <div className="column is-one-third">
                    {this.formatPost(3, 1)}
                  </div>
                  <div className="column is-one-third">
                    {this.formatPost(3, 2)}
                  </div>
                </div>
              ) : <Spinner fullPage />}
            </TabPanel>
          </Tabs>

        </div>
      </section>
    );
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

export default connect(
  mapStateToProps,
  actions,
)(Profile);
