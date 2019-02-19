import React, { Component } from 'react';
import { Field, reduxForm} from 'redux-form';
import DropZoneField from './DropZoneField';


const validate = values => {
    const errors = {}
    if (!values.displayName) {
        errors.displayName = 'Required'
    } else if (values.displayName.length < 2) {
        errors.displayName = 'Minimum be 2 characters or more'
    }
    return errors
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

class UserSetupForm extends Component {
    constructor(props) {
        super(props)
      
        this.handleSubmit = props.handleSubmit.bind(this)
      }

    state = { imageFile: [] };

    handleOnDrop = newImageFile => 
        this.setState({  
            imageFile: newImageFile.map(image => 
                Object.assign(image, 
                    {
                        preview: URL.createObjectURL(image)
                    }
                )
            ) 
    });


    render() {
        const { handleSubmit, pristine, submitting } = this.props;
        return (
            <form name="userSetupForm" onSubmit={ handleSubmit(this.props.onSubmit) } id="userSetupForm">
                <br />
                <div className="columns">
                    <div className="column is-6">
                    <Field name="displayName" component={renderField} type="text" label="Display Name" />
                    <Field name="setupBio" component={renderField} type="text" label="Biography" />                      
                    </div>
                    <div className="column is-5 is-offset-1">
                    <div className="field">
                        <label className="label">Profile Picture</label>
                        <Field
                            name="imageToUpload"
                            component={DropZoneField}
                            type="file"
                            imagefile={this.state.imageFile}
                            handleOnDrop={this.handleOnDrop}
                            />
                        <br/>

                    </div>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                    <button onClick={handleSubmit} className="button is-success" disabled={pristine || submitting}>Save</button>
                    </div>
                </div>
            </form>
        )
    }
}


UserSetupForm = reduxForm ({
    form: 'userSetupForm'
  }) (UserSetupForm);

export default UserSetupForm;