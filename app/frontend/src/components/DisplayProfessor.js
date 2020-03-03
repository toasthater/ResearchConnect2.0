import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../actions';
import ProfessorCard from './ProfessorCard';
import Spinner from './Spinner';

export default class DisplayProfessor extends Component {
    constructor(props) {
    super(props);

    this.state = {
      allPosts: [],
      posts: [],
      loading: false,
    };
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

    axios.get('/api/active_faculty_members/list')
      .then((response) => {
        this.setState({
          allPosts: response.data,
          posts: response.data,
          loading: false,
        }, () => console.log(this.state.loading));
        // this.closePosts();
      })
      .catch((error) => {
        // console.log(error);
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
          <ProfessorCard
            key={post._id}
            user={{
              id: post._id,
              profile_pic: post.profile_pic,
              name: post.name,
              cruzid: post.cruzid,
              page: post.page,
              email: post.email,
              interest: post.interest,
              title: post.title,
              pub: post.pub,
              pic: post.pic
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
                <p className="title is-4">{"Active Faculty Members"}</p>
              </div>
            </div>
          </div>
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


/* import React, { Component } from 'react';

export default class ExercisesList extends Component {
  render() {
    return (
      <div>
        <p>You are on the Exercises List component!</p>
      </div>
    )
  }
} */
