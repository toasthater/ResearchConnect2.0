import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../actions';
import PostCard from './PostCard';
import Spinner from './Spinner';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getPosts();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.posts.length !== this.state.posts.length) {
      this.getPosts();
    }
  }

  getPosts() {
    this.setState({
      posts: this.state.posts,
      loading: true,
    });

    axios.get('/api/research_posts?fill=true')
      .then((response) => {
        this.setState({
          posts: response.data,
          loading: false,
        }, () => console.log(this.state.loading));
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          posts: this.state.posts,
          loading: false,
        });
      });
  }

  formatPost(mod, eq) {
    const { posts } = this.state;
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
    if (this.state.loading) {
      return <Spinner fullPage />;
    }

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
        <div className="App" />

      </section>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Home);
