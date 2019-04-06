import React, { Component } from "react";
import { connect } from "react-redux";
import profileImg from "../assets/profile.png";
import * as actions from "../actions";
import ResumeForm from "./ResumeForm";
import axios from "axios";

import StudentProfile from "./StudentProfile"
import PostCard from "./PostCard"

import { Link } from 'react-router-dom';

class Profile extends Component {

  constructor(props) {
    super(props);

    if (this.props.match.params.cruzid === this.props.auth.cruzid) {
      this.state = {
        cruzid: this.props.match.params.cruzid,
        profileLoaded: true,
        profile: this.props.auth,
        research: []
      };
    } else {
      this.state = {
        cruzid: this.props.match.params.cruzid,
        profileLoaded: false,
        profile: null,
        following: false,
        isFollowDisabled: false,
        research: []
      };
    }

    axios.get("/api/users/", {
      params: {
        cruzid: this.props.match.params.cruzid
      }
    })
      .then(response => {
        if (response.data.isProfessor === true) {
          console.log("Fetching Professor Profile...")

          axios.get("/api/faculty_members/", {
            params: {
              cruzid: this.props.match.params.cruzid
            }
          })
            .then(response => {
              this.setState({
                professor: response.data,
                isProfessor: true
              })
            })
            .catch(error => console.log(error));

          axios
            .get("/api/research_posts?fill=true", {
              params: {
                cruzid: this.props.match.params.cruzid
              }
            })
            .then(response =>
              this.setState({
                research: response.data
              })
            )
            .then(console.log(this.state))
            .catch(error => console.log(error));
        }
        else {
          console.log("Fetching Student Profile...")

          axios.get("/api/students/", {
            params: {
              cruzid: this.props.match.params.cruzid
            }
          })
            .then(response => {
              console.log(response.data)
              this.setState({
                student: response.data,
                isProfessor: false
              })
            })
            .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));

    if (props.match.params.cruzid !== props.auth.cruzid) {
      axios
        .get("/api/users/", {
          params: {
            cruzid: this.props.match.params.cruzid
          }
        })
        .then(response =>
          this.setState({
            profileLoaded: true,
            profile: response.data,
            isFollowDisabled: false,
            following:
              this.props.auth.following &&
              this.props.auth.following.includes(this.props.match.params.cruzid)
          })
        )
        .catch(error => console.log(error));
    }
  }

  fetchResearchPosts = () => {
    const research_posts = this.state.research.map((research) =>
      <div key={research._id} className="box">
        <h1 align="left">{"Title: " + research.title}</h1>
        <br />
        <h2 align="left">{"Summary: " + research.summary}</h2>
        <br />
        <Link className="card-footer-item info" to={`/post?id=${research._id}`}>Learn More</Link>
      </div>
    );

    return (
      <ul>{research_posts}</ul>
    )
  }

  uploadResume(resume) {
    this.props.uploadResume(resume);
  }

  toggleFollow = _ => {
    const following = this.state.following;
    this.setState({ isFollowDisabled: false });
    this.setState({ following: !this.state.following });

    axios
      .post("/api/follow", {
        cruzid: this.props.match.params.cruzid,
        following: following
      })
      .then(_ => this.setState({ isFollowDisabled: false }))
      .catch(error => {
        console.log(error);
        this.setState({ following: following });
      });
  };

  render() {
    const myProfile = this.state.cruzid === this.props.auth.cruzid;

    return (
      <div>
        {this.state.profileLoaded && this.state.profile && (
          <div className="hero is-light">
            <section className="container" style={{ width: 768 }}>
              <h1 align="center">
                <br />
                <div align="center">
                  <figure className="image is-128x128">
                    <img
                      className="is-rounded"
                      src={
                        this.state.profile.profile_pic
                          ? this.state.profile.profile_pic
                          : profileImg
                      }
                      alt={this.state.profile.name}
                      width={200}
                    />
                  </figure>
                </div>
              </h1>

              <div className="column" align="center">
                {!myProfile && (
                  <div>
                    <button
                      className={
                        "button is-link " +
                        (this.state.following ? "" : "is-inverted")
                      }
                      disabled={this.state.isFollowDisabled}
                      onClick={this.toggleFollow}
                    >
                      {this.state.following ? "Following" : "Follow"}
                    </button>
                    <br />
                    <br />
                  </div>
                )}

                <div className="box is-danger">
                  {this.state.profile != null && (
                    <p> {this.state.profile.name} </p>
                  )}
                </div>

                <div className="box">
                  {this.state.profile != null && (
                    <h1>
                      {this.state.profile.email ? (<p>{this.state.profile.email}</p>) : (<p>No Email Listed</p>)}
                    </h1>
                  )}
                </div>
              </div>

              {this.state.isProfessor === true && (
                <div className="box" align="center">
                  <h1>
                    {this.state.professor.department ? (<p>{this.state.professor.department + " Department"}</p>) : (<p>No Department Listed</p>)}
                  </h1>
                </div>
              )}

              {this.state.isProfessor === true && (
                <div className="box" align="center">
                  <h1>
                    {this.state.professor.phone ? (<p>{this.state.professor.phone}</p>) : (<p>No Phone Number Listed</p>)}
                  </h1>
                </div>
              )}

              {this.state.isProfessor === true && (
                <div className="box" align="center">
                  <h1>
                    {this.state.professor.title ? (<p>{"Title: " + this.state.professor.title}</p>) : (<p>No Title Listed</p>)}
                  </h1>
                </div>
              )}

              {this.state.isProfessor === false && (
                <div className="box" align="center">
                  <h1>
                    {this.state.student.major ? (<p>{this.state.student.major + " Major"}</p>) : (<p>No Major Listed</p>)}
                  </h1>
                </div>
              )}

              <div className="column" align="left">
                <div className="box">
                  Bio:
                  {this.state.profile != null && (
                    <div>
                      {this.state.profile.bio ? (<p>{this.state.profile.bio}</p>) : (<p>No Available Bio</p>)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                {this.state.research != null && this.state.isProfessor === true && (
                  this.fetchResearchPosts()
                )}
              </div>

              <div className="column" align="center">
                {myProfile && this.props.auth && !this.props.auth.isProfessor && (
                  <div className="box">
                    <div>
                      <p>Upload Resume:</p>
                      <ResumeForm
                        onSubmit={data => this.uploadResume(data.file)}
                      />
                    </div>
                  </div>
                )}
                {this.state.profile.resume && (
                  <div>
                    <a
                      href={this.state.profile.resume}
                      className="button is-info"
                      target="_blank"
                      rel="noopener noreferrer"
                      download={this.state.profile.name + "_Resume.pdf"}
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

export default connect(
  mapStateToProps,
  actions
)(Profile);
