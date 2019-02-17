import React, { Component } from 'react'
import { connect } from 'react-redux';
import UserSetupForm from './UserSetupForm';
import * as actions from '../actions';

class Setup extends Component {

    submit = values => {
        // Need to check if they're empty
        // values.preventDefault();
        const id = this.props.auth._id;
        const name = values.name ? values.name : this.props.auth.name;
        const bio = values.bio ? values.bio : "";
        const profile_pic = values.profile_pic ? values.profile_pic : "";
        // this.props.updateUser(id, name, bio, profile_pic);
      }


    render() {     
        return (
            <section className="section">
                <div className="container">
                    <h1 className="is-size-1">Setup Profile</h1>
                    <hr className="is-link"/>
                    <UserSetupForm handleSubmit={(values) => this.submit(values)} />
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