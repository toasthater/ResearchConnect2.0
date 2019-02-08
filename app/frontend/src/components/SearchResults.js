import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import qs from 'query-string';

class SearchResults extends Component {
    componentDidMount() {
        let args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        this.searchPosts(args.type, args.query);
    }

    async searchPosts(type, query) {
        await this.props.searchPosts(type, query);

        document.querySelector(".results").innerHTML = JSON.stringify(this.props.search);
    }

    render() {
        return(
            <div>
                <h1>Results</h1>
                <p className="results">Loading...</p>
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