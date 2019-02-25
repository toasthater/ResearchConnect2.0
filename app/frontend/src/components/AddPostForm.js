import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';
import Select from 'react-select';
import Tags from './Tags';
import { Field, reduxForm} from 'redux-form';
import DropZoneField from './DropZoneField';



var rawDepartmentList;
const departmentList = [];
axios.get('/api/department').then(function(response){rawDepartmentList = response.data; populateList(rawDepartmentList)});

function populateList(list){
    for (var i = 0; i < list.length; i++) {
        var id = list[i]._id
        var name = list[i].name
  
        departmentList.push({ label: name, value: id})
    }
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div className="field">
        <label className="label">{label}</label>
        <div className="control">
        <input {...input} placeholder={label} type={type} className="input" />
        {touched && ((error && <p className="help is-danger">{error}</p>) || (warning && <p className="help is-warning">{warning}</p>))}
        </div>
    </div>
  )

class AddPostForm extends Component {
    constructor(props) {
        super(props)
      
        this.handleSubmit = props.handleSubmit.bind(this)
    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    changeDept = (e) => {
        this.setState({
            department: e
        })
    };

    onSubmit = (e) => {
        e.preventDefault();

        

        console.log(this.state);

        this.props.onSubmit()
    };


    render() {
        return (
            <form>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <Field name="title" component={renderField} type="text" placeholder="Text input"/>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Department</label>
                    <div className="control">
                        <div className="Select">
                            <Field name="department" options={departmentList} component="Select">
                            <option value="">Select a Department</option>
                            {departmentList.map(departmentOption => <option value={departmentOption} key={departmentOption.label}></option>)}</Field>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                        <Field name="description" component={renderField} type="text" placeholder="Textarea"/>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Tags</label>
                    <div className="control">
                    <Field name="tags" component={props => 
                        <Tags 
                        currentValue={{tags: props.tags}}
                        thingsChanged={param => props.onChange(param.tags)}/>} 
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Deadline</label>
                    <div className="control">
                        <Field name="deadline" component={props => 
                        <Calendar 
                        currentValue={{deadline: props.deadline}}
                        thingsChanged={param => props.onChange(param.deadline)}/>} 
                        />
                        {/* <input name="deadline" className="input" type="date" value={this.state.deadline} onChange={e => this.change(e)}></input> */}
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button onClick={e => this.onSubmit(e)} className="button is-link">Submit</button>
                    </div>
                    <div className="control">
                        <button onClick={e => this.onCancel(e)} className="button is-text">Cancel</button>
                    </div>
                </div>
            </form>
        )
    }
}

AddPostForm = reduxForm ({
    form: 'addPostForm'
  }) (AddPostForm);

export default AddPostForm;