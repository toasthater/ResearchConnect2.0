import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddPostForm from './AddPostForm';
import axios from 'axios';
import PostCard from './PostCard';

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            formIsShowing: false,
            posts: []
        }

        axios.get("/api/research_posts/")
          .then(response => {this.setState({posts: response.data}); console.log(response.data)})
          .catch(error => console.log(error) );
    }

    toggleForm = () => {
        this.setState({formIsShowing: !this.state.formIsShowing});
        this.forceUpdate()
    }

    buttonForm() {
        if (this.props.auth /*&& this.props.auth.isProfessor*/)
            if (this.state.formIsShowing)
                return (< AddPostForm onSubmit={this.onSubmit}/>)
            else
                return (<button onClick={this.toggleForm} className="button is-link">new research</button>)
    }

    onSubmit = () => {
        this.setState({formIsShowing: false});
        this.forceUpdate()
    };

    formatPost = (posts) => {
        var posts = [
            { id: 20, name: 'Captain Piett', tags: ['lol', 'what', 'this', 'is'], type: 1, professor: "Dr. Narges Norouzi" },
            { id: 24, name: 'General Veers', tags: ['lol', 'sick', 'this', 'is'], type: 2, professor: "Dr. Luca De Alfaro"  },
            { id: 56, name: 'Admiral Ozzel', tags: ['lol', 'what', 'lmao', 'is'], type: 3, professor: "Dr. Frankenstein"  },
            { id: 88, name: 'Commander Jerjerrod', tags: ['lol', 'yo', 'tag', 'moo'], type: 4, professor: "Dr. Ira Pohl" },
            { id: 89, name: 'Another Post', tags: ['lol', 'yo', 'tag', 'moo'], type: 5, professor: "Dr. Yang Liu" }
          ];
        return (
        <div className="flex-container">
            {posts.map(post => (<PostCard  key={post.id} post={post} />))}
        </div>)
    }

    render() {
        return(
            <section className="section">
            <div className="App">
            {this.buttonForm()}
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