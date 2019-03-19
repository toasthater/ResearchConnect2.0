import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import axios from 'axios';
import PostCard from './PostCard';
import Spinner from './Spinner';

class Home extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            posts: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        this.getPosts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.posts.length !== this.state.posts.length) {
            this.getPosts();
        }
    }

    getPosts() {
        this.setState({
            posts: this.state.posts,
            loading: true
        });

        axios.get("/api/research_posts?fill=true")
        .then(response => {
            this.setState({ 
                posts: response.data,
                loading: false
            }, () => console.log(this.state.loading));
        })
        .catch(error => {
            console.log(error);
            this.setState({
                posts: this.state.posts,
                loading: true
            });
        });
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
        if (this.state.loading) {
            return <Spinner fullPage />;
        }

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

export default connect(mapStateToProps, actions)(Home);