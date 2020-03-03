import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../actions';
import ProfessorCard from './ProfessorCard';
import Spinner from './Spinner';


export default class ProTip extends Component {
    constructor(props) {
    super(props);

    this.state = {
      allPosts: [],
      posts: [],
      loading: true,
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
  }

  

  render() {
    const { loading, posts } = this.state;
    /* if (loading) {
      return <Spinner fullPage />;
    } */

    
    return (
        
        <section className="section">
          <div className="container">
          <div className="columns">
            <div className="column" style={{ marginBottom: '1em' }}>
              <div className="field">
                <p className="title is-4">{"Pro Tips"}</p>
              </div>
            </div>
          </div>
          
          <h2><b>1.	Stick to a budget. </b></h2>
            <p>
            This tip is likely not all that difficult to follow if you’re a regular graduate student. But, when you do score some extra cash (for whatever reason) try your best to put it towards paying your bills, savings or paying off loans and interest. 
            <br></br>
            Because, chances are, you’ll want to have a splurge session and, quite honestly, we don’t blame you. It really is in your best interest to pay off your debt!
            </p>
            <br></br>
          <h2><b>2.	Let yourself be a student.</b></h2>
            <p>
            Repeat: I am a grad student. I am learning. I will make mistakes. Seriously, don’t be so hard on yourself. What you’re doing is seriously admirable and really difficult. The world really isn’t going to come to an end if you make a mistake, we promise. 
            </p>
            <br></br>
          <h2><b>3.	Make the most of your resources. </b></h2>
            <p>
            There are a lot of resources provided to students like you. You just need to: 1. Find out what they are. 2. Utilize them. 
            <br></br>
            Refer to your professors, go to their office hours and ask the right questions. When in doubt, refer to number eight on this list!
            </p>
            <br></br>
          <h2><b>4.	Never forget you have an advisor.  </b></h2>
            <p>
            Your advisor is there to help with any questions you may have regarding programs, research, faculty issues, etc. 
            <br></br>
            Don’t forget about this important person you should have on speed dial! If your advisor doesn’t have an answer for you, he or she will be able to point you in the right direction of the contact who will. 
            <br></br>
            It’s even advisable to set up a regular meeting with your advisor to check in and see how things are progressing for you. So many students neglect to do this. 
            <br></br>
            Think about it this way, you’re <i>paying</i> for their services indirectly, so why not utilize them? 
            </p>
            <br></br>
          <h2><b>5.	Select work you’re passionate about. </b></h2>
            <p>
            You can’t devote hours on end to learning and working on something you can’t stand. It’s as simple as that. You’ll grow tired of it and simply won’t put forth the endless effort that it takes to get through days and nights of studying and working towards a goal. 
            <br></br>
            Bottom line: pick something you absolutely live and breathe so that you can live with your decision.
            </p>
            <br></br>
          
          </div>

          
          <br></br>
          <br></br>
          

          <div
            className="video"
            style={{
                position: "relative",
                paddingBottom: "56.25%" /* 16:9 */,
                paddingTop: 25,
                
                height: 0
            }}
          >
            <iframe
            style={{
                position: "absolute",
                top: 0,
                left: 450,
                width: "40%",
                height: "40%"
            }}
            src={`https://www.youtube.com/embed/jZDtgiGXLBE`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            />

          </div>
        </section>

        
      );
  }
}





