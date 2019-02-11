import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner } from './Spinner';
import Form from './Addpostform';

class Home extends Component {
    
    showForm() {
        return(<Form />)
    };

    render() {
        return(
            <section className="section">
            <div className="App">
            {this.props.auth ? <button onClick={this.showForm()} class="button is-link">new research</button>: 'not logged in'}
            <Form />
            </div>
            
             {this.props.auth ? this.props.auth.isProfessor ? 'You are a professor' : 'You are a student' : <Spinner fullPage/>}
            </section>
        );
    }
}

function mapStateToProps({auth}){
    return { auth };
  }

export default connect(mapStateToProps)(Home);