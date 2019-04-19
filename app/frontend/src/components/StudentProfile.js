import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import profileImg from "../assets/profile.png";

class StudentProfile extends Component {

  render() {
    return (
      <div>
        <section className="container" style={{ width: 768 }}>
          <div className="column" align="center">

            <h1 align="center">
              <br />
              <div align="center">
                <figure className="image is-128x128">
                  <img className="is-rounded"
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

            <br /><br />

            <div className="box">
              {this.props.profile.name ? this.props.profile.name : "No Name Listed"}
            </div>

            <div className="box">
              {this.props.profile.email ? this.props.profile.email : "No Email Listed"}
            </div>

            {<div className="box">
              {this.props.student.major ? this.props.student.major : "No Major Listed"}
            </div>}

            <div className="box">
              <p align="left">Bio:</p>
              <p align="left">{this.props.profile.bio ? this.props.profile.bio : "No Available Bio"}</p>
            </div>

            <div>
              <a
                href={this.props.resume}
                className="button is-info"
                target="_blank"
                rel="noopener noreferrer"
                download={this.props.profile.name + "_Resume.pdf"}
              >
                {this.props.resume ? "Download Resume" : "No Resume Available"}
              </a>
            </div>
          </div>
        </section>
      </div>

    )
  }
}

export default withRouter(StudentProfile)
