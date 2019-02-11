import React, { Component } from 'react'
import { connect } from 'react-redux';
import ProfessorForm from './ProfessorForm';
import StudentForm from './StudentForm';

class Setup extends Component {


    render() {
        
        return (
            <section className="section">
            <div className="container">
                <h1 className="is-size-1">Setup Profile</h1>
                { this.props.auth.isProfessor ? <ProfessorForm /> : <StudentForm />}
            </div>
            
        </section>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
  }

export default connect(mapStateToProps)(Setup);