import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Modal from 'react-modal';

class ApplicantCard extends PureComponent {
    state = {
      showModal: false,
    };

    onSubmit(applicationID, accept) {
      this.props.onSubmit(applicationID, accept);
    }

    getQuestions = () => {
      let q = this.props.questions.map((question, i) =>
        <div key={"Question " + i} align="center" style={{ marginBottom: "1em" }}>
          <h1 className="subtitle">{"Question #" + (i + 1)}</h1>
          <p>{question}</p>
          <p>{this.props.applicant.responses[i]}</p>
        </div>
      );
  
      return <div>{q}</div>
    }

    openModal = () => {
      this.setState({ showModal: true });
    }

    closeModal = () => {
      this.setState({ showModal: false });
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
                      {(!this.props.questions || this.props.questions.length === 0 || !this.props.applicant.responses || this.props.applicant.responses.length === 0) ?
                      <div className="columns" align="center">
                        <div className="column">
                          <button className="button is-danger is-link" onClick={() => this.onSubmit(applicant.id, false)}>Decline</button>
                        </div>
                        <div className="column">
                          <button className="button is-link" onClick={() => this.onSubmit(applicant.id, true)}>Accept</button>
                        </div>
                      </div> : 
                      <div>
                        <button className="button is-link" onClick={() => this.openModal()}>Review</button>
                      </div>}
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

            <Modal isOpen={this.state.showModal} contentLabel="Questionnaire">
              {this.getQuestions()}
              <div className="columns" align="center">
                <div className="column">
                  <button onClick={() => this.onSubmit(applicant.id, false)} className="button is-link is-danger">Decline</button>
                </div>
                <div className="column"> 
                  <button onClick={() => this.onSubmit(applicant.id, true)} className="button is-link">Accept</button>
                </div>
                <div className="column"> 
                  <button onClick={() => this.closeModal()} className="button is-warning is-link">Close</button>
                </div>
              </div>
            </Modal>
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
