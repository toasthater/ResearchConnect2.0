import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import profileImg from '../assets/profile.png';
import Spinner from './Spinner';

class ProfessorInfoPage extends Component {
  
  render() {
    const { user } = this.props;


    return (
      <div id={user.cruzid} className="container">
        <div className="columns">
          <div className="column is-half is-offset-3">
            <div className="column" align="center">
              <h1 align="center">
                <br />
                <div align="center">
                  <figure className="image is-128x128">
                    <img
                      className="is-rounded"
                      src={
                        user.pic
                          ? user.pic
                          : profileImg
                      }
                      alt={user.name}
                      style={{height: "128px", width: "auto"}}
                    />
                  </figure>
                </div>
              </h1>

              <hr />

              

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Name</h2>
                <h1 className="title is-4">{user.name ? user.name : 'No Name Listed'}</h1>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Title</h2>
                <h1 className="title is-4">{user.title ? user.title : 'No Title Listed'}</h1>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Email</h2>
                <h1 className="title is-4">{user.email ? user.email : 'No Email Listed'}</h1>
              </div>

              {<div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Department</h2>
                <h1 className="title is-4">{user.department ? user.department : 'No Department Listed'}</h1>
              </div>}

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Bio</h2>
                <h1 className="title is-4">{user.bio ? user.bio : 'No Available Bio'}</h1>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Prefered Ways of Contact</h2>
                <h1 className="title is-4">{user.bio ? user.bio : 'No Available Bio'}</h1>
              </div>

              <div className="box">
                <h2 className="subtitle is-uppercase is-size-7">Prefered Ways of Contact</h2>
                <h1 className="title is-4">{user.pub ? user.pub : 'No Available Bio'}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfessorInfoPage);
