import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class ResumeFileInput extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    onChange(e.target.files[0]);
  }

  render() {
    // const { input: { value } } = this.props;
    return (
      <div>
        <input
          type="file"
          accept=".pdf"
          onChange={this.onChange}
        />
      </div>
    );
  }
}

class ResumeForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div>
        <Field name="file" component={ResumeFileInput} />
        <button className="button is-success" disabled={pristine || submitting} onClick={handleSubmit}>Upload</button>
      </div>
    );
  }
}

ResumeForm = reduxForm({
  form: 'resumeForm',
})(ResumeForm);

export default ResumeForm;
