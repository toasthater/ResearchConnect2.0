import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import * as actions from '../actions';

import Spinner from './Spinner';
import InfoPage from './ProfessorInfoPage';
import PostCard from './PostCard';

class Profile extends Component {
  

  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      loading: false,
    };

    this.setProfileStates();

    
  }

  componentDidMount() {
    
    this.setProfileStates1();
    console.log("test")
  }

  setProfileStates = () => {
    // Fetch and set user specific data to local states
    axios
      .get('/api/active_faculty_members/', {
        params: {
          cruzid: this.props.match.params.cruzid,
        },
      })
      /* .then(response => this.setState({
        profile: response.data,
        
        
      })) */
      .then(response => function(){
        console.log(response)
      })
      .catch(error => console.log(error));
  }

  setProfileStates1() {
    // Fetch and set user specific data to local states
    axios
      .get('/api/active_faculty_members/', {
        params: {
          cruzid: this.props.match.params.cruzid,
        },
      })
      .then(response => this.setState({
        profile: response.data,
        
        
      }))
      .catch(error => console.log(error));
  }

  

  


  displayProfessorProfile() {
    const post = this.state.profile;
    console.log(post);
    if (post == null) {
      return (
        <InfoPage
          
          user={{
            id:"asas",
            
          }}
        />
      );
    }
    return (
      <InfoPage
        
        user={{
          id: post._id,
          profile_pic: post.pic,
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
    );
  }

  


  render() {
    /* if (!this.state.profileLoaded || !this.state.userLoaded) {
      return <Spinner fullPage />;
    } */

    const { research: posts } = this.state;
    // console.log(posts)

    return (
      <section className="section">
        
        <div className="container has-text-centered">
          <Tabs>
            <TabList>
              <Tab>Professor</Tab>
              <Tab>Projects</Tab>
            </TabList>

            <TabPanel>
              {this.displayProfessorProfile()}
            </TabPanel>

            <TabPanel>
              {false ? (
                <div>
                  {posts.length ? (
                    <div className="columns is-multiline" style={{ paddingTop: '1em' }}>
                      <div className="column is-one-third">
                        
                      </div>
                      <div className="column is-one-third">
                        
                      </div>
                      <div className="column is-one-third">
                        
                      </div>
                    </div>
                  ) : (
                      <h1 className="title">Nothing here yet!</h1>
                    )}
                </div>
              ) : <Spinner fullPage />}
            </TabPanel>

          </Tabs>

        </div>
      </section>
    );
  }
}

function mapStateToProps({ auth, profile }) {
  return { auth, profile };
}

export default connect(
  mapStateToProps,
  actions,
)(Profile);
