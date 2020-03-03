import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import profileImg from '../assets/profile.png';

class ProfessorCard extends PureComponent {
  render() {
    const { user } = this.props;
    const page = user.page;

    return (
      <div key={user.id} className="card" style={{ borderRadius: '5px', marginBottom: '2.5em' }}>
        <div className="card-image has-text-centered" style={{ top: '-1em' }}>
          <figure className="image is-128x128" style={{ display: 'inline-block' }}>
            <img src={user.pic ? user.pic : profileImg} alt="" className="is-rounded" style={{maxHeight: "148px", maxWidth: "128px"}} />
          </figure>
        </div>
        <div className="card-content" style={{ paddingTop: '0px' }}>
          <p className="title is-4">{ user.name }</p>
          <p className="subtitle is-6">
            { user.title ? user.title : "No title defined" }
          </p>
          
          <div className="email">
            { user.email ? user.email : "No email defined" }
          </div>

          <div className="interests">
            <p className="subtitle is-8">
              
              <br></br>
              { "Research Interests:" }
            </p>
            { user.interest ? user.interest : "No interests defined" }
          </div>
          <div className="page">
            <br></br>
            <a href={page} target="_blank">Visit UCSC page </a>
          </div>
            
        </div>
        <footer className="card-footer">
          <Link className="card-footer-item has-text-success" to={`/info/${user.cruzid}`}>
            More Info
          </Link>
        </footer>
      </div>
    );
  }
}

export default withRouter(ProfessorCard);
