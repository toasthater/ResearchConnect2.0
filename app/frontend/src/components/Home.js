import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner } from './Spinner';
import axios from 'axios';

class Home extends Component {
    componentDidMount(){
        console.log(this.props.auth);
        this.getData();
    }

    async getData(){
        const res = await axios.get('/api/search/Default/mantey');
        console.log(res.data);
    }
    render() {
        return(
            <section className="section">
             {this.props.auth ? this.props.auth.isProfessor ? 'You are a professor' : 'You are a student' : <Spinner fullPage/>}
            </section>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
  }

export default connect(mapStateToProps)(Home);