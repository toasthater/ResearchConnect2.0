import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import axios from 'axios';
import PostCard from './PostCard';

class SearchResults extends Component {
    componentDidMount() {
        this.setState({ search: [] });
    }

    async componentDidUpdate() {
        console.log(this.props.search);
    }

    formatPost() {
        var posts = this.props.search;

        if (posts == undefined) {
            return (
                <div className="flex-container"></div>
            );
        }

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
            <div id="search_results_container">
                {this.formatPost()}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        search: state.search
    };
  }

export default connect(mapStateToProps, actions)(SearchResults);