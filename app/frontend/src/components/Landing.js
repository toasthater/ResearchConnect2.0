import React, { Component } from 'react';
import landing from '../assets/hero.jpg';
import { LazyImg } from './LazyImg';
import signinButton from '../assets/google_signin.png';

export default class Landing extends Component {
    render() {
        return(
            
            <section className="hero is-fullheight">
              <div className="hero-body">
                <div className="container">
                  <h1 className="title is-size-1 has-text-white ">
                    ResearchConnect
                  </h1>
                  <h2 className="subtitle is-size-4 has-text-weight-bold has-text-white ">
                    A platform for UCSC students to connect with faculty and pursue research opportunities.
                  </h2>
                  <a href="/auth/google">
                    <img src={signinButton} width="200"  className="is-clickable" role="button" alt="Sign In"/>
                  </a>
                </div>
              </div>
            </section>
        )
    }
}