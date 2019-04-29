import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';

class ApplicantCard extends PureComponent {
    onSubmit(applicationID, accept) {
        this.props.onSubmit(applicationID, accept);
    }


    render() {
        const applicant = this.props.applicant;
        if (applicant.status === 'pending') {
 return (
   <div key={applicant.id} className="flex-item">
     <div className="flex-item-inner">
       <div className="flex-item-inner-content">
         <div className="card rounded">
           <div className="card-content">
             <div className="media">
               <div className="media-content">
                 <Link className="subtitle is-6 has-text-link" to={applicant.ownerProfile}>{applicant.cruzid}</Link>
               </div>
             </div>

             <div className="content">
               <div className="columns" align="center">
                 <div className="column">
                   <button className="button is-danger is-link" onClick={() => this.onSubmit(applicant.id, false)}>Decline</button>
                 </div>
                 <div className="column">
                   <button className="button is-link" onClick={() => this.onSubmit(applicant.id, true)}>Accept</button>
                 </div>
               </div>
             </div>
             <footer className="card-footer">
               <div>
                 <a
                   align="center"
                   href={applicant.student.resume}
                   className="button is-info"
                   target="_blank"
                   rel="noopener noreferrer"
                   download={`${applicant.cruzid }_Resume.pdf`}
                   disabled={!applicant.student.resume}
                 >
                   {applicant.student.resume ? 'Download Resume' : 'No Resume Available'}
                 </a>
               </div>
             </footer>
           </div>
         </div>
       </div>
     </div>
   </div>
);
}
        return (
          <div key={applicant.id} className="flex-item">
            <div className="flex-item-inner">
              <div className="flex-item-inner-content">
                <div className="card rounded">
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <Link className="subtitle is-6 has-text-link" to={applicant.ownerProfile}>{applicant.cruzid}</Link>
                      </div>
                    </div>

                    <footer className="card-footer">
                      <div className="card-footer-item info">{applicant.status}</div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
);
    }
}

export default withRouter(ApplicantCard);
