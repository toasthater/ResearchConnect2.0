import React, { Component } from "react";
import { connect } from "react-redux";
import profileImg from "../assets/profile.png";
import * as actions from "../actions";
import ResumeForm from "./ResumeForm";
import EditProfile from "./EditProfile";

//import otherProfiles from "./otherProfiles.js";

class Profile extends Component {
  componentDidUpdate() {
    console.log(this.props);
  }

  handleEditProfile() {
    //return <Redirect from="/*" to="/home" />;
  }

  uploadResume(resume) {
    this.props.uploadResume(resume);
  }

  render() {
    return (
      <div className="hero is-light">
        <section className="container" style={{ width: 768 }}>
          <h1 align="center">
            <br />
            <img
              className="is-rounded"
              src={
                this.props.auth.profile_pic
                  ? this.props.auth.profile_pic
                  : profileImg
              }
              alt={this.props.auth.name}
              width={200}
            />
            <br />
            <br />
          </h1>

          <div className="column" align="center">
            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.props.profile != null && (
                <form> {this.props.profile.name} </form>
              )}
            </div>

            <div className="box" style={{ background: "#2EEF8F" }}>
              {this.props.profile != null && (
                <h1>
                  {" "}
                  {this.props.profile.email ? (
                    <p>{this.props.profile.email}</p>
                  ) : (
                    <p>No Email Listed</p>
                  )}{" "}
                </h1>
              )}
            </div>
          </div>

          <div className="column" align="center">
            <div className="box" style={{ background: "#17864F" }}>
              {this.props.profile != null && (
                <h1>
                  {" "}
                  {this.props.profile.major ? (
                    <p>{this.props.profile.major}</p>
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
              {this.props.profile != null && (
                <div>
                  {" "}
                  {this.props.profile.bio ? (
                    <p>{this.props.profile.bio}</p>
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
                {this.props.profile != null && (
                  <h1>
                    {" "}
                    {this.props.profile.resume ? (
                      <p>{this.props.profile.resume}</p>
                    ) : (
                      <p>No Resume Listed</p>
                    )}{" "}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
    //} else {
    //  return <div>Loading...</div>;
    //}
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

export default connect(
  mapStateToProps,
  actions
)(Profile);
