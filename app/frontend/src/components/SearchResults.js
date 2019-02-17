import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import '../styles/searchresults.scss';

class SearchResults extends Component {
    componentDidMount() {
        this.setState({ search: [] });
    }

    componentDidUpdate() {
        let results = this.props.search;
        if (results === null || results.length === 0)
        {
            results = "No results found :(";
        }

        document.querySelector(".results").innerHTML = JSON.stringify(results);
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