import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from './Addpostform';

class Home extends Component {
    
    state = {
        formIsShowing: true //false
    }
    test = () => {this.state.formIsShowing = !this.state.formIsShowing; console.log(this.state);};

    buttonForm() {
        if (this.props.auth /*&& this.props.auth.isProfessor*/)
            if (this.state.formIsShowing)
                return (< Form onSubmit={this.onSubmit}/>)
            else
                return (<button onClick={() => this.state.formIsShowing = true} class="button is-link">new research</button>)
    }

    onSubmit = () => {
        console.log('Submitted')
        this.state.formIsShowing = false
    };

    render() {
        return(
            <section className="section">
             {this.props.auth ? this.props.auth.isProfessor ? 'You are a professor' : 'You are a student' : 'Data is loading'}
            <div className="App">
            <button onClick={this.test}>Test</button>
            {this.buttonForm()}
            </div>
            </section>
        );
    }
}

function mapStateToProps({auth}){
    return { auth };
}

export default connect(mapStateToProps)(Home);