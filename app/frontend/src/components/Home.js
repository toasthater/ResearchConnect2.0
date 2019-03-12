import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PostCard from './PostCard';

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }

        axios.get("/api/research_posts?fill=true")
          .then(response => {this.setState({posts: response.data}); console.log(response.data)})
          .catch(error => console.log(error));
    }

    formatPost() {
        var posts = this.state.posts;
        return (
        <div className="flex-container">
            {posts.map(post => (<PostCard  key={post._id} post={{
                id: post._id,
                type: post.department.type,
                name: post.title,
                professor: post.owner.name,
                tags: post.tags,
                summary: post.summary,
                department: post.department.name
            }} />))}
        </div>)
    }

    render() {
        return(
            <section className="section">
            <div className="App">
            </div>
            
                {this.formatPost()}
            
            </section>
        );
    }
}

function mapStateToProps({auth}){
    return { auth };
}

export default connect(mapStateToProps)(Home);