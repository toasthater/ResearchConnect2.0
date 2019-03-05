import React, { Component } from "react";
import { connect } from "react-redux";
import profileImg from "../assets/profile.png";
import * as actions from "../actions";
import ResumeForm from "./ResumeForm";
import axios from 'axios';

//import otherProfiles from "./otherProfiles.js";

class Profile extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.params.cruzid === this.props.auth.cruzid){
      this.state = {
        profileLoaded: true,
        profile: this.props.auth
      };
    }
    else {
      this.state = {
        profileLoaded: false,
        profile: null
      };
    }
    
    if (props.match.params.cruzid !== props.auth.cruzid)
     {
      axios.get("/api/users/", {
        params: {
          cruzid: this.props.match.params.cruzid
        }
      })
      .then(response => {this.setState({profileLoaded: true, profile: response.data}); console.log(this.state)})
      .catch(error => console.log(error) );
    }
  }


  componentDidUpdate() {
    // console.log(this.props);
  }

  handleEditProfile() {
    //return <Redirect from="/*" to="/home" />;
  }

  uploadResume(resume) {
    this.props.uploadResume(resume);
  }

  render() {
    return (
      <div>
      {this.state.profileLoaded && this.state.profile && (<div className="hero is-light">
        <section className="container" style={{ width: 768 }}>
          <h1 align="center">
            <br />
            <img
              className="is-rounded"
              src={
                this.state.profile
                  ? this.state.profile.profile_pic
                  : profileImg
              }
              alt={this.state.profile.name}
              width={200}
            />
            <br />
            <br />
          </h1>

          <div className="column" align="center">
            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.state.profile != null && (
                <form> {this.state.profile.name} </form>
              )}
            </div>

            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.state.profile != null && (
                <h1>
                  {" "}
                  {this.state.profile.email ? (
                    <p>{this.state.profile.email}</p>
                  ) : (
                    <p>No Email Listed</p>
                  )}{" "}
                </h1>
              )}
            </div>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#17864F" }}>
              {this.state.profile != null && (
                <h1>
                  {" "}
                  {this.state.profile.major ? (
                    <p>{this.state.profile.major}</p>
                  ) : (
                    <p>No Major Listed</p>
                  )}{" "}
                </h1>
              )}
            </div>
          </div>

          <div className="column" align="left">
            <div className="box">
              Bio:
              {this.state.profile != null && (
                <div>
                  {" "}
                  {this.state.profile.bio ? (
                    <p>{this.state.profile.bio}</p>
                  ) : (
                    <p>No Available Bio</p>
                  )}{" "}
                </div>
              )}
            </div>
          </div>

          <div className="column">
            <div className="box">
              <p>Upload Resume:</p>
              <ResumeForm onSubmit={data => this.uploadResume(data.file)} />
              <br />
              <br />
              <a className="button">Download Resume</a>
              <br />
              <br />
              <p>Current Resume:</p>
              <div>
                {this.state.profile != null && (
                  <h1>
                    {" "}
                    {this.state.profile.resume ? (
                      <p>{this.state.profile.resume}</p>
                    ) : (
                      <p>No Resume Listed</p>
                    )}{" "}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>)}
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
