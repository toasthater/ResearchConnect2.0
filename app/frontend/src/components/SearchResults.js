import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import PostCard from './PostCard';

class SearchResults extends Component {
  formatPost() {
    const { search } = this.props;

    if (search === undefined) {
      return (
        <div className="flex-container" />
      );
    }

    return (
      <div className="flex-container">
        {search.map(post => (
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

SearchResults.propTypes = {
  search: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    department: PropTypes.object,
    title: PropTypes.string,
    owner: PropTypes.object,
    tags: PropTypes.arrayOf(PropTypes.string),
    summary: PropTypes.string,
  })),
};

SearchResults.defaultProps = {
  search: [],
};

const mapStateToProps = state => ({
  search: state.search,
});

export default connect(mapStateToProps, actions)(SearchResults);
