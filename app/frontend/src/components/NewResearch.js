import React, { Component } from 'react';
import AddPostForm from './AddPostForm';


class NewResearch extends Component {
    onSubmit = () => {
        this.props.history.push('/');
    };

    render() {
        return (
          <div className="section container">
            <div className="columns">
              <div className="column is-half is-offset-one-quarter">
                <h1 className="title has-text-centered">CREATE RESEARCH POST</h1>
                <AddPostForm onSubmit={this.onSubmit} />
              </div>
            </div>
          </div>
);
    }
}

export default NewResearch;
