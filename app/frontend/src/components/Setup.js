import React, { Component } from 'react'
import { connect } from 'react-redux';
import ProfessorForm from './ProfessorForm';
import StudentForm from './StudentForm';

class Setup extends Component {

    setupProfessor = values => {
        console.log(JSON.stringify (values));
      }
    
    setupStudent = values => {
        console.log(JSON.stringify (values));
    }

    render() {     
        return (
            <section className="section">
                <div className="container">
                    <h1 className="is-size-1">Setup Profile</h1>
                    <hr className="is-link"/>
                    { this.props.auth.isProfessor ? <ProfessorForm onSubmit={this.setupProfessor} /> : <StudentForm onSubmit={this.setupStudent}/>}
                </div>
            </section>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
  }

export default connect(mapStateToProps)(Setup);