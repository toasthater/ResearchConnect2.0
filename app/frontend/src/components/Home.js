import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddPostForm from './AddPostForm';

class Home extends Component {
    
    state = {
        formIsShowing: false,
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