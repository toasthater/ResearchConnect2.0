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
      allPosts: [],
      posts: [],
      loading: false,
    };
  }

  handleFilterChange = (event) => {
    const { value } = event.target;
    const { allPosts } = this.state;
    const f = value.trim().toLowerCase();
    if (!f) {
      return this.setState(prevState => ({
        posts: prevState.allPosts,
      }));
    }

    const filteredPosts = allPosts.filter((post) => {
      console.log(post)
      return (
        post.summary.toLowerCase().includes(f) ||
        post.department.name.toLowerCase().includes(f) ||
        post.owner.cruzid.toLowerCase().includes(f) ||
        post.owner.name.toLowerCase().includes(f) ||
        post.description.toLowerCase().includes(f) ||
        post.title.toLowerCase().includes(f) ||
        post.tags.reduce((acc, t) => {
          if (acc) {
            return acc;
          }
          return t.toLowerCase().includes(f);
        }, false) ||
        false
      )
    });
    return this.setState({
      posts: filteredPosts,
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getPosts();
  }

  getPosts() {
    const { posts, loading } = this.state;
    this.setState({
      allPosts: posts,
      posts,
      loading: true,
    });

    axios.get('/api/research_posts?fill=true')
      .then((response) => {
        this.setState({
          allPosts: response.data,
          posts: response.data,
          loading: false,
        }, () => console.log(this.state.loading));
        // this.closePosts();
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          allPosts: posts,
          posts,
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
    const { loading, posts } = this.state;
    if (loading) {
      return <Spinner fullPage />;
    }

    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column" style={{ marginBottom: '1em' }}>
              <div className="field">
                <div className="control">
                  <input className={`input is-medium ${!posts.length ? 'is-danger' : ''}`} type="text" placeholder="Filter by title, professor, tags, and department... Try 'computer science' or 'unity'" onChange={this.handleFilterChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="columns is-multiline">
            <div className="column is-one-third">
              {this.formatPost(3, 0)}
            </div>
            <div className="column is-one-third">
              {this.formatPost(3, 1)}
              { posts.length ? null : (
                <div className="has-text-centered title">
                  Nothing matched that filter! Try something else
                </div>
              ) }
            </div>
            <div className="column is-one-third">
              {this.formatPost(3, 2)}
            </div>
          </div>
        </div>
        <div className="App" />
        { posts.length ? (
          <div className="container is-size-3">
            <center>That's all folks, come back later to see new posts!</center>
          </div>
        ) : null }
      </section>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Home);
