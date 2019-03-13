import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import { Field, reduxForm } from "redux-form";
import DropZoneField from "./DropZoneField";

const renderField = ({
  input,
  label,
  type,
  rows,
  meta: { touched, error, warning }
}) => (
  <div className="field">
    <label className="label">{label}</label>
    <div className="control">
      <textarea {...input} placeholder={label} type={type} rows={rows} className="textarea" style={{resize:"none", width: "100%"}} />
      {touched &&
        ((error && <p className="help is-danger">{error}</p>) ||
          (warning && <p className="help is-warning">{warning}</p>))}
    </div>
  </div>
);

class EditProfileForm extends Component {
  required = value => value ? undefined : "Required";

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <br />
        <div className="box">
          <Field
            name="displayName"
            component={renderField}
            type="text"
            label="Display Name"
            rows={1}
            validate={this.required}
          />
          <br />
          <br />
          <Field
            name="major"
            component={renderField}
            type="text"
            label={this.props.isProfessor ? "Department" : "Major"}
            rows={1}
            validate={this.required}
          />
          <br />
          <br />
          <Field
            name="bio"
            component={renderField}
            type="text"
            label="Bio"
            rows={5}
            validate={this.required}
          />
          <br />
          <br />
          <button
            onClick={handleSubmit}
            className="button is-success"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

EditProfileForm = reduxForm({
  form: "editProfileForm"
})(EditProfileForm);

class EditProfile extends Component {
  handleSubmit(formData) {
    console.log(formData);
    let newProfile = {
      cruzid: this.props.auth.cruzid,
      name: formData.displayName,
      bio: formData.bio
    };

    this.props.updateUser(newProfile);

    let newMajor = {
      cruzid: this.props.auth.cruzid,
      major: formData.major
    };

    this.props.updateProfile(newMajor);
    this.props.fetchProfile(this.props.auth.cruzid);
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="is-size-1">Edit Profile</h1>
          <hr className="is-link"/>
          <EditProfileForm onSubmit={values => this.handleSubmit(values)} isProfessor={this.props.auth.isProfessor} />
        </div>
      </section>
    )
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

export default connect(mapStateToProps, actions)(EditProfile);
