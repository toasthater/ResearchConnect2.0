import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import PostCard from './PostCard';
import UserCard from './UserCard';

class SearchResults extends Component {
  componentDidMount() {
    // Initialize state
    this.setState({ search: [] });
  }

  async componentDidUpdate() {
    console.log(this.props.search);
  }

  // Search through requested posts and if they exist format them
  formatPost(mod, eq) {
    const results = this.props.search;

    // Place a message in the center column if there are no results
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

<<<<<<< HEAD
    // Return a HTML body with formated posts
=======
    // googleId always exists in users, but not posts, so it can be used to check the type of the result
    // (index % mod) === eq filters posts into 3 distinct data sets, one for each column of the page
>>>>>>> 5346396d2786ae99ae32daa46a6b88873d2c392b
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
    // Return formatted data
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
