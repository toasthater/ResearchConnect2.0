import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class SearchBar extends Component {
  render() {
    const { handleSubmit } = this.props;
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
                  <option>User</option>
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
              <button type="submit" className="button is-inverted is-primary">
                        Search
              </button>
            </p>
          </div>
        </form>
      </div>

    );
  }
}

SearchBar = reduxForm({
  form: 'search',
})(SearchBar);

export default SearchBar;
