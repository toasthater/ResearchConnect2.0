import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

const SearchBar = (props) => {
  const { handleSubmit } = props;
  return (
    <div className="navbar-item">
      <form name="search" onSubmit={handleSubmit}>
        <div className="field has-addons">
          <p className="control">
            <span className="select">
              <Field name="type" component="select" className="select">
                <option>Default</option>
                <option>Department</option>
                <option>Professor</option>
                <option>Title</option>
                <option>Tag</option>
              </Field>
            </span>
          </p>
          <p className="control">
            <Field
              name="query"
              component="input"
              type="text"
              placeholder="Search"
              className="input"
            />
          </p>
          <p className="control">
            <button type="submit" className="button is-inverted is-link">
              Search
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'search',
})(SearchBar);
