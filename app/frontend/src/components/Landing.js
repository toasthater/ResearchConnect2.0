import React, { Component } from 'react';
import landing from '../assets/hero.jpg';
import signinButton from '../assets/google_signin.png';
import LazyImg from './LazyImg';

export default class Landing extends Component {
  render() {
    return(
      <React.Fragment>
				<LazyImg src={landing} style={{ backgroundColor: '#000000' }} className="home">
					<section className="hero is-medium has-text-centered">
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
				<section>
					<div className="container">
						<div className="columns has-text-centered">
							<div className="column">
								<div className="title">Professors</div>
								<div className="subtitle">Post your open research and lab positions to find the best students UCSC has to offer</div>
							</div>
							<div className="column">
								<div className="title">Students</div>
								<div className="subtitle">Find the best open research positions tailored towards your interests and skills</div>
							</div>
							<div className="column">
								<div className="title">Grads/Ph.D</div>
								<div className="subtitle">Find students to help in your current research something something something</div>
							</div>
						</div>
					</div>
				</section>
				<hr />
				<section>
					<div className="container">
						<div className="title">How it works</div>
						<ul className="steps is-medium">
							<li className="step-item is-black is-active">
								<div className="step-marker">
									<span className="icon">
										<i className="fa fa-envelope"></i>
									</span>
								</div>
								<div className="step-details">
									<p className="step-title">Step 1</p>
									<p>Sign in with your <strong>@ucsc.edu</strong> email with Google.</p>
								</div>
							</li>
							<li className="step-item is-primary is-completed is-active">
								<div className="step-marker">
									<span className="icon">
										<i className="fa fa-check-square"></i>
									</span>
								</div>
								<div className="step-details">
									<p className="step-title">Step 2</p>
									<p>Apply for open positions based on your interests and skills.</p>
								</div>
							</li>
							<li className="step-item is-info is-completed is-active">
								<div className="step-marker">
									<span className="icon">
										<i className="fa fa-check-square"></i>
									</span>
								</div>
								<div className="step-details">
									<p className="step-title">Step 3</p>
									<p>If you get selected, interview with the professor.</p>
								</div>
							</li>
							<li className="step-item is-success is-active">
								<div className="step-marker">
									<span className="icon">
										<i className="fa fa-flag"></i>
									</span>
								</div>
								<div className="step-details">
									<p className="step-title">Step 4</p>
									<p>Congrats! Now go help make the world a better place!</p>
								</div>
							</li>
						</ul>
					</div>
				</section>
				<section className="section"></section>
			</React.Fragment>
      )
    }
  }
