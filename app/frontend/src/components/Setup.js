import React, { Component } from 'react'
import { connect } from 'react-redux';
import UserSetupForm from './UserSetupForm';
import * as actions from '../actions';

class Setup extends Component {

    handleSubmit = values => {
        const body = {
            'id' : this.props.auth._id,
            'name' : values.displayName,
            'bio' : values.setupBio,
            'files' : values.files ? values.files[0].file : null
        }
        
        this.props.updateUser(body);
      }


    render() {     
        return (
            <section className="section">
                <div className="container">
                    <h1 className="is-size-1">Setup Profile</h1>
                    <hr className="is-link"/>
                    <UserSetupForm onSubmit={this.handleSubmit} />
                </div>
            </section>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
}

Setup = connect(mapStateToProps, actions)(Setup);  

export default Setup;