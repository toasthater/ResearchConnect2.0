import React, { Component } from 'react'
import { connect } from 'react-redux';

class ProfessorForm extends Component {


    render() {
        const name = this.props.name;
        
        return (
            <form onSubmit={this.handleSubmit} >
            
            <br/>

            <div className="columns">
                <div className="column is-6">
                <div className="field">
                    <label className="label">Display Name</label>
                    <div className="control">
                    <input className="input" type="text" value={name} required onChange={this.handleChange} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Biography</label>
                    <div className="control">
                    <input className="input" type="text" value={name} required onChange={this.handleChange} />
                    </div>
                </div>            
                </div>
                <div className="column is-5 is-offset-1">
                <div className="field">
                    <label className="label">Profile Picture</label>
                    <figure className="image shadowed" style={{ height: 256, width: 256, background: 'white' }}>
                    </figure>
                    <br/>
                    <button className="button">Select Image </button>
                </div>
                </div>
            </div>
            <div className="field">
                <div className="control">
                <button type="submit" className="button is-success">Save</button>
                </div>
            </div>
            </form>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
  }

export default connect(mapStateToProps)(ProfessorForm);