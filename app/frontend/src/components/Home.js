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

  // async closePosts() {
  //   console.log("Checking deadlines")
  //   var currentDate = new Date();
  //   var postsToClose = [];

  //   this.state.posts.forEach(function (post) {
  //     var postDate = new Date(post.deadline);
  //     if (post.status === 'Open' && currentDate > postDate) {
  //       post.status = 'Closed';
  //       postsToClose.push(post);
  //     }
  //   });

  //   console.log(postsToClose)
  //   await Promise.all([
  //     postsToClose.forEach(function (post) {
  //       console.log("axios push");
  //       const newPost = {
  //         _id: post._id,
  //         title: post.title,
  //         owner: post.owner.cruzid,
  //         cruzid: post.owner.cruzid,
  //         tags: post.tags,
  //         summary: post.summary,
  //         description: post.description,
  //         department: {
  //           value: post.department._id,
  //           label: post.department.name,
  //         },
  //         status: post.status,
  //         deadline: post.deadline,
  //       };
  //       axios.post(`/api/research_posts?id=${post._id}`, newPost);
  //     })
  //   ]);
  // }

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
        // this.closePosts();
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

        <div className="container is-size-2 has-background-grey-light">
          <center>Search to discover more</center>
        </div>
      </section>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Home);
