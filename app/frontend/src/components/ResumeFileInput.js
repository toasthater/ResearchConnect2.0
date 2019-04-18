import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

ResumeFileInput.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
  }),
};

ResumeFileInput.defaultProps = {
  input: {
    onChange: null,
  },
};

export default ResumeFileInput;
