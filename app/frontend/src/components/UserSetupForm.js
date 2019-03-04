import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import DropZoneField from "./DropZoneField";

const required = value => (value ? undefined : "Required");

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

const maxLength15 = maxLength(15);

const name = value =>
  value && maxLength15 && !/^[a-zA-Z ]+$/.test(value)
    ? "Invalid Name"
    : undefined;

// const renderTextArea = ({input, label, meta: { touched, error, warning }}) => (
//     <div className="field">
//         <label className="label">{label}</label>
//         <div className="control">
//             <textarea {...input} placeholder="Content" rows="5" cols="40" className="textarea"/>
//             {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
//         </div>
//     </div>
// );

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div className="field">
    <label className="label">{label}</label>
    <div className="control">
      <input {...input} placeholder={label} type={type} className="input" />
      {touched &&
        ((error && <p className="help is-danger">{error}</p>) ||
          (warning && <p className="help is-warning">{warning}</p>))}
    </div>
  </div>
);

class UserSetupForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = props.handleSubmit.bind(this);
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <form
        name="userSetupForm"
        onSubmit={handleSubmit(this.props.onSubmit)}
        id="userSetupForm"
      >
        <br />
        <div className="columns">
          <div className="column is-6">
            <Field
              name="displayName"
              component={renderField}
              type="text"
              label="Display Name"
              validate={[required, name]}
            />
            <Field
              name="setupBio"
              component={renderField}
              type="text"
              label="Summary"
            />
          </div>
          <div className="column is-5 is-offset-1">
            <div className="field">
              <label className="label">Profile Picture</label>
              <Field name="files" component={DropZoneField} type="file" />
              <br />
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              onClick={handleSubmit}
              className="button is-success"
              disabled={pristine || submitting}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    );
  }
}

UserSetupForm = reduxForm({
  form: "userSetupForm"
})(UserSetupForm);

export default UserSetupForm;
