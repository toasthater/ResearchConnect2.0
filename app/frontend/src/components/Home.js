import React, { Component } from 'react';
import { connect } from 'react-redux';
import Addpostform from './Addpostform';

class Home extends Component {
    
    state = {
        formIsShowing: false,
    }

    toggleForm = () => {this.state.formIsShowing = !this.state.formIsShowing; this.forceUpdate()}

    buttonForm() {
        if (this.props.auth /*&& this.props.auth.isProfessor*/)
            if (this.state.formIsShowing)
                return (< Addpostform onSubmit={this.onSubmit}/>)
            else
                return (<button onClick={this.toggleForm} className="button is-link">new research</button>)
    }

    onSubmit = () => {
        console.log('Submitted')
        this.state.formIsShowing = false
        this.forceUpdate()
    };

    render() {
        return(
            <section className="section">
            <div className="App">
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