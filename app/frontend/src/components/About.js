import React from 'react';

import logoImg from '../assets/logo.svg';


export default () => (
  <div className="container">
    <br />
    <h1 className="is-size-1">About</h1>

    <div className="content">
      <h1 align="center">
        <br />
        <img src={logoImg} alt="ResearchConnect" width={200} />
        <br />
      </h1>
      <h4 align="center">
Connecting UCSC students to faculty & research opportunities.
        <span role="img" aria-label="jsx-a11y/accessible-emoji">🎓 🧪</span>
      </h4>
      <p align="center">
        <a href="#the-issue">The Issue</a>
        {' '}
•
        <a href="#our-solution">Our Solution</a>
        {' '}
•
        <a href="#install">Install</a>
        {' '}
•
        <a href="#install">Run</a>
        {' '}
•
        <a href="#deploy">Deploy</a>
        {' '}
•
        <a href="#api-used">API Used</a>
        {' '}
•
        <a href="#credits">Credits</a>
        {' '}
•
        <a href="#license">Authors</a>
      </p>
      <h2 id="theissue">The Issue</h2>
      <ul>
        <li>Finding research opportunities on campus can be a very frustrating experience. </li>
        <li>There is no central platform for students to connect with faculty.</li>
      </ul>
      <h2 id="oursolution">The Audience</h2>
      <ul>
        <li> We aim to connect UCSC students to faculty and research opportunities.</li>
      </ul>
      <h2 id="install">Install</h2>
      <ul>
        <li><pre>$ cd research_connect/app/frontend</pre></li>
        <li><pre>$ npm install</pre></li>
      </ul>
      <h2 id="apiused">API Used</h2>
      <p>For this application, we used the following APIs :</p>
      <ul>
        <li>FireBase</li>
      </ul>
      <br />
    </div>
  </div>
);
