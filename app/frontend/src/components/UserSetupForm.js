import React, { Component } from 'react';
import {Form, Field, reduxForm} from 'redux-form';
import DropZoneField from './DropZoneField';


class UserSetupForm extends Component {
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
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} >
            
            <br/>

            <div className="columns">
                <div className="column is-6">
                <div className="field">
                    <label className="label">Display Name</label>
                    <div className="control">
                    <Field
                        name="setupName"
                        component="input"
                        type="text"
                        placeholder="John Smith"
                        className="input"
                      />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Biography</label>
                    <div className="control">
                    <Field
                        name="setupBio"
                        component="input"
                        type="text"
                        placeholder="I was born in the alps.."
                        className="input"
                      />
                    </div>
                </div>            
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
                <button className="button is-success">Save</button>
                </div>
            </div>
            </form>
        )
    }
}

UserSetupForm = reduxForm ({
    form: 'setup'
  }) (UserSetupForm);
  
  export default UserSetupForm;