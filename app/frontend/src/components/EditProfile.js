import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import * as actions from '../actions';
import UserSetupForm from './UserSetupForm';
import EditProfileForm from './EditProfileForm';
import Spinner from './Spinner';
import 'react-tabs/style/react-tabs.css';

class EditProfile extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notification: this.props.auth.notification,
      notificationLoaded: false,
      reloadNotification: false,
    }
  }

  componentDidMount() {
    var cruzid = this.props.auth.cruzid

    this.props.fetch_notification(cruzid).then(response => {
      this.setState({
        notification: response,
        notificationLoaded: true
      })
    }).catch(err => console.log("err: " + err))
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state)
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

  handleNotificationClear(cruzid, id) {
    this.props.clearNotification(cruzid, id)
      .then(response => {
        this.setState({
          reloadNotification: true
        })

        this.props.fetch_notification(cruzid).then(response => {
          this.setState({
            notification: response,
            reloadNotification: false
          })
        })
      })
  }

  display_notifications = () => {

    var cruzid = this.props.auth.cruzid

    if (this.state.notification.length === 0) {
      return (
        <ul><br />{"No notifications to show..."}</ul>
      );
    }

    const notifications = this.state.notification.map(notification => (
      <div className="box" key={notification._id}>
        <p align="left"><strong>Subject:</strong> {`${notification.subject}`}</p>
        <br />
        <p align="left"><strong>Message:</strong> {`${notification.message}`}</p>
        <br />

        {(notification.type === 'applied') &&
          <div>
            <p align="left"><strong>Applicant Information:</strong></p>
            <p align="left">{`Name: ${notification.applicantName}`}</p>

            <p align='left'>Resume:&nbsp;

            {notification.applicantResume === 'None' ?
                <a href={notification.applicantResume} target="_blank">resume.pdf</a> :
                <a>No resume available</a>}

            </p>

            <br />
          </div>
        }

        <p align="left"><strong>Send Date:</strong> {`${notification.date}`}</p>
        <br />
        <button type="button" onClick={() => this.handleNotificationClear(cruzid, notification._id)}>Clear</button>
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
          <h1 className="is-size-1">Settings</h1><br />

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
              <div className="subtitle">Coming Soon!</div>
            </TabPanel>
            <TabPanel>
              {!this.state.reloadNotification ? this.display_notifications() : <Spinner fullPage />}
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
