import React, { Component } from 'react'
import { connect } from 'react-redux';
import ProfessorForm from './ProfessorForm';
import StudentForm from './StudentForm';
import * as actions from '../actions';

class Setup extends Component {

    setupProfessor = values => {
        // Need to check if they're empty
        values.preventDefault();
        console.log(values);
        const id = this.props.auth._id;
        const name = values.name ? values.name : this.props.auth.name;
        const bio = values.bio ? values.bio : "";
        const profile_pic = values.profile_pic ? values.profile_pic : "";
        this.props.updateUser(id, name, bio, profile_pic);
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
                    { this.props.auth.isProfessor ? <ProfessorForm name={this.props.auth.name} onSubmit={this.setupProfessor} /> : <StudentForm onSubmit={this.setupStudent}/>}
                </div>
            </section>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
  }

export default connect(mapStateToProps, actions)(Setup);