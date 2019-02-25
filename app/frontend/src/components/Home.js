import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddPostForm from './AddPostForm';

class Home extends Component {

    handleSubmit = values => {
        const title = values.title ? values.title: '';
        const tags = values.tags ? values.tags: [];
        const description = values.description ? values.description: '';
        const department = values.department ? values.department : {label: "Academic Senate", value: "5c4ab51421e1383889614c73"};
        const deadline = values.deadline ? values.deadline: new Date();
        const owner = this.props.auth._id;

        this.state.formIsShowing = false
        this.forceUpdate()
        
        //this.props.updateUser(id, name, bio, profile_pic);
      }
    
    state = {
        formIsShowing: false,
    }

    toggleForm = () => {this.state.formIsShowing = !this.state.formIsShowing; this.forceUpdate()}

    buttonForm() {
        if (this.props.auth /*&& this.props.auth.isProfessor*/)
            if (this.state.formIsShowing)
                return (<AddPostForm onSubmit={this.handleSubmit} />)
            else
                return (<button onClick={this.toggleForm} className="button is-link">new research</button>)
    }

    render() {
        return(
            <section className="section">
            <div className="App">
            {this.buttonForm()}
            </div>
            </section>
        );
    }
}

function mapStateToProps({auth}){
    return { auth };
}

export default connect(mapStateToProps)(Home);