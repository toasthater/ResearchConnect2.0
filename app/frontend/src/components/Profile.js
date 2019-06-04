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
      this.setState({
        followingLoaded: false,
        profileLoaded: false,
        researchLoaded: false,
        userLoaded: false,
        departmentLoaded: false,
      });

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
        followingLoaded: false,
        followedResearch: [],
        departmentLoaded: false,
        departmentResearch: [],
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
        if (this.props.auth.cruzid === this.props.match.params.cruzid && response.data.following) {
          var promises = [];
          for (var i = 0; i < response.data.following.length; i++) {
            promises.push(axios.get('/api/search?type=cruzid&query=' + response.data.following[i]));
          }

          Promise.all(promises).then(responses => {
            var posts = [];
            for (var i = 0; i < responses.length; i++) {
              for (var j = 0; j < responses[i].data.length; j++) {
                posts.push(responses[i].data[j]);
              }
            }

            this.setState({
              followedResearch: posts,
              followingLoaded: true,
            });
          }).catch(err => console.log(err));
        } else {
          this.setState({
            followingLoaded: true,
          })
        }

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
                profValue: true,
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
                profValue: false,
                userLoaded: true,
              });

              if (response.data.major) {
                axios.get('/api/search?type=Department&query=' + response.data.major).then(response => {
                  this.setState({
                    departmentLoaded: true,
                    departmentResearch: response.data,
                  })
                })
              } else {
                this.setState({
                  departmentLoaded: true,
                });
              }
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
        <h1 align="left">{`Title: ${research.title}`}</h1>
        <br />
        <h2 align="left">{`Summary: ${research.summary}`}</h2>
        <br />
        <Link className="card-footer-item info" to={`/post/${research._id}`}>Learn More</Link>
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
        auth={{
          cruzid: this.props.auth.cruzid,
          isProfessor: this.props.auth.isProfessor,
        }}
        profile={this.state.profile}
        student={{
          major: this.state.student.major,
          endorsements: this.state.student.endorsements,
          id: this.state.student._id,
        }}
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

  formatPost(posts, mod, eq) {
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
              deadline: post.deadline,
              date: new Date(post.deadline),
              applicants: this.props.auth.isProfessor ? post.applicants.map(applicant => applicant.student ? applicant.student.cruzid : "") : null
            }}
          />
        ))}
      </React.Fragment>
    )
  }

  async makeProfessor(val) {
    console.log(this.state)
    var request = {
      isAdmin: this.props.auth.isAdmin ? this.props.auth.isAdmin : false,
      name: this.state.profile.name,
      cruzid: this.state.cruzid,
      isProfessor: !val
    };
    if (val) {
      // if he's a professor, make him a student
      // closes all the open posts by this professor
      axios.post('/api/students', request).then().catch(err => {
        console.log(err);
      });
    }
    else {
      // if he's a student, make him a professor
      axios.post('/api/faculty_members', request).then().catch(err => {
        console.log(err);
      });
    }

    // toggle professor
    await axios.post('/api/toggleProfessor', request).then().catch(err => {
      console.log(err);
    });

    // update state
    this.setState({
      profValue: !val
    });
  }

  render() {
    if (!this.state.profileLoaded || !this.state.userLoaded) {
      return <Spinner fullPage />;
    }

    const { research: posts } = this.state;
    console.log(posts)

    return (
      <section className="section">
        {this.props.auth.isAdmin && (
          <div className="columns is-centered">
            <div className="column is-one-third">
              <button
                className={`button is-fullwidth ${this.state.profValue ? 'is-danger is-outlined' : 'is-link'}`}
                onClick={() => this.makeProfessor(this.state.profValue)}
              >
                {this.state.profValue ? 'Make Student' : 'Make Professor'}
              </button>
            </div>
          </div>
        )}
        <div className="container has-text-centered">
          <Tabs>
            <TabList>
              {!this.state.isProfessor && <Tab>Student</Tab>}
              {this.state.isProfessor && <Tab>Professor</Tab>}
              <Tab>Projects</Tab>
              {this.props.auth.cruzid === this.props.match.params.cruzid && <Tab>Following</Tab>}
              {this.props.auth.cruzid === this.props.match.params.cruzid && <Tab>Major</Tab>}
            </TabList>

            <TabPanel>
              {!this.state.isProfessor && this.displayStudentProfile()}
              {this.state.isProfessor && this.displayProfessorProfile()}
            </TabPanel>

            <TabPanel>
              {this.state.researchLoaded ? (
                <div>
                  {posts.length ? (
                    <div className="columns is-multiline" style={{ paddingTop: '1em' }}>
                      <div className="column is-one-third">
                        {this.formatPost(posts, 3, 0)}
                      </div>
                      <div className="column is-one-third">
                        {this.formatPost(posts, 3, 1)}
                      </div>
                      <div className="column is-one-third">
                        {this.formatPost(posts, 3, 2)}
                      </div>
                    </div>
                  ) : (
                      <h1 className="title">Nothing here yet!</h1>
                    )}
                </div>
              ) : <Spinner fullPage />}
            </TabPanel>

            {this.props.auth.cruzid === this.props.match.params.cruzid &&
              <>
                <TabPanel>
                  {this.state.followingLoaded ?
                    ((this.state.followedResearch && this.state.followedResearch.length > 0) ?
                      <div className="columns is-multiline" style={{ paddingTop: '1em' }}>
                        <div className="column is-one-third">
                          {this.formatPost(this.state.followedResearch, 3, 0)}
                        </div>
                        <div className="column is-one-third">
                          {this.formatPost(this.state.followedResearch, 3, 1)}
                        </div>
                        <div className="column is-one-third">
                          {this.formatPost(this.state.followedResearch, 3, 2)}
                        </div>
                      </div>
                      : <p>No research to show</p>)
                    : <Spinner fullPage />}
                </TabPanel>

                <TabPanel>
                  {this.state.departmentLoaded ?
                    ((this.state.departmentResearch && this.state.departmentResearch.length > 0) ?
                      <div className="columns is-multiline" style={{ paddingTop: '1em' }}>
                        <div className="column is-one-third">
                          {this.formatPost(this.state.departmentResearch, 3, 0)}
                        </div>
                        <div className="column is-one-third">
                          {this.formatPost(this.state.departmentResearch, 3, 1)}
                        </div>
                        <div className="column is-one-third">
                          {this.formatPost(this.state.departmentResearch, 3, 2)}
                        </div>
                      </div>
                      : <p>No research to show</p>)
                    : <Spinner fullPage />}
                </TabPanel>
              </>
            }
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
