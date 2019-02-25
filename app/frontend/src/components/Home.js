import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddPostForm from './AddPostForm';
import axios from 'axios';

class Home extends Component {

    handleSubmit = values => {
        const title = values.title ? values.title: '';
        const owner = this.props.auth._id;
        const tags = values.tags ? values.tags: [];
        const description = values.description ? values.description: '';
        const department = values.department ? values.department : "5c4ab51421e1383889614c73";
        const deadline = values.deadline ? values.deadline: new Date();

        var submission = {
            title: title ? title:'',
            owner: owner ? owner: '',
            tags: tags ? tags: '',
            description: description ? description: '',
            department: department ? department: '',
            deadline: deadline ? deadline: ''
        }
        if (submission.title != '')
            axios.post('/api/research_posts', {...submission});  
        this.onSubmit()
      }
    
    state = {
        formIsShowing: false,
    }

    onSubmit = () => {
        this.state.formIsShowing = false
        this.forceUpdate()
    };


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