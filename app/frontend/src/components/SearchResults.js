import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import qs from 'query-string';
import '../styles/searchresults.scss';
import { debug } from 'util';

class SearchResults extends Component {
    componentDidMount() {
        let args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        this.searchPosts(args.type, args.query);
    }

    async searchPosts(type, query) {
        let tags = [];
        let ret = [];
        await this.props.searchPosts(type, query);
        tags = JSON.stringify(this.props.search).split("]");
        ret = JSON.stringify(this.props.search).split(",");

        document.querySelector(".results").innerHTML = "";
        document.querySelector(".title").innerHTML = ret[3];
        document.querySelector(".desc").innerHTML = ret[5];
        document.querySelector(".tags").innerHTML = tags[0] + "]";
        document.querySelector(".department").innerHTML = ret[6];
        document.querySelector(".professor").innerHTML = ret[4];
    }

    render() {
        return(
            <div>
                <h1>Results</h1>
                <dl className="results">Loading...</dl>
                <p className="title"></p>
                <p className="desc"></p>
                <p className="tags"></p>
                <p className="department"></p>
                <p className="professor"></p>
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