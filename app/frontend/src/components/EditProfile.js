import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import * as actions from '../actions';
import UserSetupForm from './UserSetupForm';
import EditProfileForm from './EditProfileForm';
import axios from 'axios';
import Spinner from './Spinner';
import 'react-tabs/style/react-tabs.css';

class EditProfile extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notification: [],
      notificationLoaded: false
    }
  }

  componentDidMount() {
    this.fetch_notifications()
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log(this.state)
  }

  handleSubmitStudent(formData) {
    const data = {
      profile_id: this.props.profile._id,
      major: formData.major,
    };
    this.props.updateProfile(data);
  }


  handleSubmitUser = (values) => {
    const body = {
      id: this.props.auth._id,
      name: values.displayName,
      bio: values.setupBio,
      filename: values.files ? values.files[0].name : '',
      files: values.files ? values.files[0].file : null,
    };

    this.props.updateUser(body);
  }

  fetch_notifications() {
    axios.get("/api/notification/", {
      params: {
        cruzid: "gkchoi",
        type: "applied"
      }
    }).then(response => {
      this.setState({
        notification: response.data,
        notificationLoaded: true
      })
    })
  }

  handleNotification = () => {
    this.props.notify_user("gkchoi", "applied")
  }

  display_notifications = () => {

    const notifications = this.state.notification.map(notification => (
      <div className="box" key={notification._id}>
        <p align="left">{`Message: ${notification.message}`}</p>
        <br />
      </div>
    ));

    return (
      <ul>{notifications}</ul>
    );
  }

  render() {
    if (!this.state.notificationLoaded) {
      return <Spinner fullPage />;
    }

    return (
      <section className="section">
        <div className="container has-text-centered">
          <h1 className="is-size-1">Settings</h1>

          <br /><button type="button" onClick={() => this.handleNotification()}>Apply Button</button><br /><br />

          <Tabs>
            <TabList>
              <Tab>User</Tab>
              {!this.props.auth.isProfessor && <Tab>Student</Tab>}
              <Tab>Privacy</Tab>
              <Tab>Notifications</Tab>
            </TabList>

            <TabPanel>
              <UserSetupForm onSubmit={this.handleSubmitUser} user={this.props.auth} initialValues={{ displayName: [this.props.auth.name], setupBio: [this.props.auth.bio] }} />
            </TabPanel>
            {!this.props.auth.isProfessor && (
              <TabPanel>
                {this.props.profile && <EditProfileForm onSubmit={values => this.handleSubmitStudent(values)} isProfessor={this.props.auth.isProfessor} initialValues={{ major: [this.props.profile.major] }} />}
              </TabPanel>
            )}
            <TabPanel>
              <p>Not Yet Implemented.</p>
            </TabPanel>
            <TabPanel>
              {this.display_notifications()}
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

export default connect(mapStateToProps, actions)(EditProfile);
