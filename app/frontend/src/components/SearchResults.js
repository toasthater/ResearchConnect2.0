import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import '../styles/searchresults.scss';
import axios from 'axios';

class SearchResults extends Component {
    componentDidMount() {
        this.setState({ search: [] });
    }

    async componentDidUpdate() {
        let results = this.props.search;
        if (results === null || results.length === 0)
        {
            results = "No results found :(";
        }
        else
        {
            const department = await axios.get('/api/department?id=' + results[0].department);
            const faculty = await axios.get('/api/faculty_members?id=' + results[0].owner);

            document.querySelector(".results").innerHTML = "";
            document.querySelector("#title").innerHTML = results[0].title;
            document.querySelector("#desc").innerHTML = results[0].description;
            document.querySelector("#tags").innerHTML = JSON.stringify(results[0].tags);
            document.querySelector("#department").innerHTML = department.data.department.name;
            document.querySelector("#professor").innerHTML = faculty.data.faculty.name;
        }
    }

    render() {
        return(
            <div id="search_results_container">
                <div className="box">
                    <dl className="results">Loading...</dl>
                    <p className="research_item light_green_box" id="title"></p>
                    <p className="research_item" id="desc"></p>
                    <p className="research_item" id="tags"></p>
                    <p className="research_item" id="department"></p>
                    <p className="research_item" id="professor"></p>
                </div>
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