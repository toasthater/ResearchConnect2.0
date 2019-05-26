import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import PostCard from './PostCard';
import UserCard from './UserCard';

class SearchResults extends Component {
  componentDidMount() {
    this.setState({ search: [] });
  }
  
  formatPost(mod, eq) {
    const results = this.props.search;

    if (!results || results.length === 0) {
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

    return (
      <React.Fragment>
        {results.filter((_, index) => (index % mod) === eq).map(item => (
          item.googleId ?
          <UserCard
            key={item._id}
            user={{
              id: item._id,
              profile_pic: item.profile_pic,
              name: item.name,
              isAdmin: item.isAdmin,
              isProfessor: item.isProfessor,
              bio: item.bio,
              cruzid: item.cruzid,
            }}
          />
          : <PostCard
            key={item._id}
            post={{
              id: item._id,
              type: item.department.type,
              name: item.title,
              professor: item.owner.name,
              tags: item.tags,
              summary: item.summary,
              department: item.department.name,
              ownerProfile: `/profile/${item.owner.cruzid}`,
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
