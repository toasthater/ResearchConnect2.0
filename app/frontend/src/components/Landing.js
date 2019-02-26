import React, { Component } from 'react';
import landing from '../assets/hero.jpg';
import signinButton from '../assets/google_signin.png';
import LazyImg from './LazyImg';

export default class Landing extends Component {
  render() {
    return(
      <LazyImg src={landing} style={{ background: '#888888' }} className="home">
		<section className="hero is-fullheight">
			<div className="hero-body">
				<div className="container">
					<h1 className="title is-size-1 has-text-white ">
					ResearchConnect
					</h1>
					<h2 className="subtitle is-size-4 has-text-weight-bold has-text-white ">
					Connecting UCSC students & faculty to improve involvement in research.
					</h2>
					<a href="/auth/google">
					<button style={{
                background: `url("${signinButton}")`, backgroundSize: 'cover', width: 196, height: 46, border: 'none',
              }} className="button" onClick={this.signIn} title="Sign In"/>
                  	</a>
				</div>
			</div>
		</section>
      </LazyImg>
      )
    }
  }