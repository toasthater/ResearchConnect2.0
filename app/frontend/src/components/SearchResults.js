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

  formatPost() {
    const posts = this.props.search;

    if (posts === undefined) {
      return (
        <div className="flex-container" />
      );
    }

    return (
      <div className="flex-container">
        {posts.map(post => (
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
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.formatPost()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
});

export default connect(mapStateToProps, actions)(SearchResults);
