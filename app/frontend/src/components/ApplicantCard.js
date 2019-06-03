import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Modal from 'react-modal';

class ApplicantCard extends PureComponent {
  state = {
    showModal: false,
    disableInterviewButton: false
  };

  onSubmit(applicationID, accept) {
    this.props.onSubmit(applicationID, accept);

    if (accept === true) {
      this.props.sendAccepted(this.props.postID, this.props.applicant.cruzid);
    }
    else {
      this.props.sendDeclined(this.props.postID, this.props.applicant.cruzid);
    }
  }

  handleInterviewSubmission() {
    this.props.sendInterview(this.props.postID, this.props.applicant.cruzid)

    this.setState({
      disableInterviewButton: true
    })
  }

  getQuestions = () => {
    if (!this.props.questions) {
      return <div></div>;
    }

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
    const { applicant } = this.props;
    return (
      <React.Fragment>
        <div className="column">
          {applicant.student.name}
        </div>
        <div className="column">
          <Link to={applicant.ownerProfile}>{applicant.cruzid}</Link>
        </div>
        {(!this.props.questions || this.props.questions.length === 0 || !this.props.applicant.responses || this.props.applicant.responses.length === 0) ?
          <React.Fragment>
            <div className="column is-2"><button className="button is-danger is-link is-fullwidth" onClick={() => this.onSubmit(applicant.id, false)}>Decline</button></div>
            <div className="column is-2"><button className="button is-link is-fullwidth" onClick={() => this.onSubmit(applicant.id, true)}>Accept</button></div>
          </React.Fragment> :
          <React.Fragment>
            <div className="column is-2"><button className="button is-link is-fullwidth" onClick={() => this.openModal()}>Review</button></div>
          </React.Fragment>
        }
        <div className="column is-2">
          <a
              align="center"
              href={applicant.student.resume}
              className="button is-info  is-fullwidth"
              target="_blank"
              rel="noopener noreferrer"
              download={`${applicant.cruzid}_Resume.pdf`}
              disabled={!applicant.student.resume}
            >
            {applicant.student.resume ? 'Download Resume' : 'No Resume Available'}
          </a>
        </div>
        <div className="column is-2">
          <a
              align="center"
              href={'#' + this.props.match.url}
              className="button is-info  is-fullwidth"
              onClick={() => this.handleInterviewSubmission()}
              disabled={this.state.disableInterviewButton}
            //target="_blank"
            //rel="noopener noreferrer"
          >
            Interview
          </a>
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
      </React.Fragment>
    );
    if (applicant.status === 'pending') {
      return (
        <div key={applicant.id} className="flex-item">
          <div className="flex-item-inner">
            <div className="flex-item-inner-content">
              <div className="card rounded">
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">

                    </div>
                  </div>

                  <div className="content">

                  </div>
                  <footer className="card-footer">
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
