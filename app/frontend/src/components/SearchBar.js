import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/searchbar.scss';
import * as actions from '../actions';
import {Field, reduxForm} from 'redux-form';

class SearchBar extends Component {


    async handleSubmit(e) {
      e.preventDefault();

      let type = document.querySelector(".dropdown-trigger").innerHTML;
      let query = document.querySelector(".input").value;

      // window.location = '/search_results?type=' + type + "&query=" + query;
    }

    render() {
        const {handleSubmit} = this.props;
        return(
              <div className="navbar-item">
              <form onSubmit={handleSubmit}>
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
              
        )
    }
}

SearchBar = reduxForm ({
  form: 'search',
}) (SearchBar);

export default SearchBar;