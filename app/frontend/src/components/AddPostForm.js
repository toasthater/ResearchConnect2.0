import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';
import Select from 'react-select';
import Tags from './Tags';
import { Field, reduxForm} from 'redux-form';
import DropZoneField from './DropZoneField';
import moment from 'moment'


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

const RenderSelectInput = ({input, options, name, id}) => (
    <Select 
         {...input}
         id={id} 
         name={name} 
         options={options}
         value={input.value}
         onChange={(value) => input.onChange(value.value)}
         onBlur={(value) => input.onBlur(value.value)}
    />
);

const renderCalendar = ({input, placeholder, defaultValue, meta: {touched, error} }) => (
    <div>
          <Calendar {...input} dateForm="MM/DD/YYYY" selected={input.value ? moment(input.value) : null} />
          {touched && error && <span>{error}</span>}
    </div>
  );

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div className="field">
        <label className="label">{label}</label>
        <div className="control">
        <input {...input} placeholder={label} type={type} className="input" />
        {touched && ((error && <p className="help is-danger">{error}</p>) || (warning && <p className="help is-warning">{warning}</p>))}
        </div>
    </div>
  );

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

    onCancel = (e) => {
        e.preventDefault();
        this.props.onSubmit()
    };



    render() {
        const { handleSubmit, pristine, submitting, reset } = this.props;
        return (
            <form onSubmit={ handleSubmit(this.props.onSubmit) } id="addPostForm">
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
                            <Field name="department" options={departmentList} component={RenderSelectInput} />
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
                        <Field name="deadline" component={renderCalendar}/>
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button onClick={handleSubmit} className="button is-link">Submit</button>
                    </div>
                    <div className="control">
                        <button onClick={reset} className="button is-text">Cancel</button>
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
