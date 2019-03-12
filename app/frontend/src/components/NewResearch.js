import React, { Component } from 'react';
import AddPostForm from './AddPostForm';
import axios from 'axios';


class NewResearch extends Component {

    onSubmit = () => {
        this.props.history.push('/')
    };
    
    render() {
        return(
        <div>
            < AddPostForm onSubmit={this.onSubmit}/>
        </div>)
    }
}

export default NewResearch;