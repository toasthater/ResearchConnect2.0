import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import profileImg from "../assets/profile.png";

class ProfessorProfile extends Component {
  render() {
    return (
      <div className="container" style={{ width: 768 }}>
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

          <div className="box">
            {this.props.profile.name ? this.props.profile.name : "No Name Listed"}
          </div>

          <div className="box">
            {this.props.professor.title ? this.props.professor.title : "No Title Listed"}
          </div>

          <div className="box">
            {this.props.profile.email ? this.props.profile.email : "No Email Listed"}
          </div>

          {<div className="box">
            {this.props.professor.department ? this.props.professor.department : "No Department Listed"}
          </div>}

          <div className="box">
            <p align="left">Bio:</p>
            <p align="left">{this.props.profile.bio ? this.props.profile.bio : "No Available Bio"}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ProfessorProfile)
