import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import PostCard from './PostCard';

class SearchResults extends Component {
  componentDidMount() {
    this.setState({ search: [] });
  }

  async componentDidUpdate() {
    console.log(this.props.search);
  }

  // Search through requested posts and if they exist format them
  formatPost(mod, eq) {
    const posts = this.props.search;

    if (!posts || posts.length === 0) {
      if (eq === 1) {
        return (
          <div className="has-text-centered title">
            Sorry, we couldn't find any matches! :(
          </div>
        );
      }
      return (
        <div />
      );
    }

    // Return a HTML body with formated posts
    return (
      <React.Fragment>
        {posts.filter((_, index) => (index % mod) === eq).map(post => (
          <PostCard
            key={post._id}
            post={{
              id: post._id,
              type: post.department.type,
              name: post.title,
              professor: post.owner.name,
              tags: post.tags,
              summary: post.summary,
              department: post.department.name,
              ownerProfile: `/profile/${post.owner.cruzid}`,
            }}
          />
        ))}
      </React.Fragment>
    );
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-one-third">
              {this.formatPost(3, 0)}
            </div>
            <div className="column is-one-third">
              {this.formatPost(3, 1)}
            </div>
            <div className="column is-one-third">
              {this.formatPost(3, 2)}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
});

export default connect(mapStateToProps, actions)(SearchResults);
