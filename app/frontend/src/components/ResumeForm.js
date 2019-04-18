import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import ResumeFileInput from './ResumeFileInput';

const ResumeForm = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <div>
      <Field name="file" component={ResumeFileInput} />
      <button type="button" className="button is-success" disabled={pristine || submitting} onClick={handleSubmit}>Upload</button>
    </div>
  );
};

ResumeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'resumeForm',
})(ResumeForm);
