import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

const required = value => (value ? undefined : "Required");

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

const maxLength15 = maxLength(15);

const name = value =>
  value && maxLength15 && !/^[a-zA-Z ]+$/.test(value)
    ? "Invalid Name"
    : undefined;

const renderTextArea = ({
  input,
  label,
  type,
  rows,
  meta: { touched, error, warning }
}) => (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <textarea {...input} placeholder={label} type={type} rows={rows} className="textarea" style={{ resize: "none", width: "100%" }} />
        {touched &&
          ((error && <p className="help is-danger">{error}</p>) ||
            (warning && <p className="help is-warning">{warning}</p>))}
      </div>
    </div>
  );

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

class EditProfileForm extends Component {
  required = value => value ? undefined : "Required";

  render() {
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div>
        <form
          name="editProfileForm"
          onSubmit={handleSubmit(this.props.onSubmit)}
          id="editProfileForm"
        >
          <br />
          <div className="columns is-centered">
            <div className="column is-6">
              <Field
                name="major"
                component={renderField}
                type="text"
                label="Major"
                rows={1}
                validate={[required, name]}
              />
              <div className="field is-centered">
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
            </div>
          </div>
        </form>
      </div>
    );
  }
}

EditProfileForm = reduxForm({
  form: "editProfileForm"
})(EditProfileForm);


export default EditProfileForm;