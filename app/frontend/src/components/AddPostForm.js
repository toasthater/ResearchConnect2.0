import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Calendar from 'react-calendar';
import Select from 'react-select';
import Tags from './Tags';


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

class AddPostForm extends React.Component { 
    state = {
        title: '',
        tags: [],
        summary: '',
        description: '',
        department: {label: "Academic Senate", value: "5c4ab51421e1383889614c73"},
        deadline: new Date(),
        owner: this.props.auth.cruzid,
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

    async onSubmit(e) {
        e.preventDefault();
        await axios.post('/api/research_posts', { ...this.state });  

        console.log(this.state);
        this.setState({
            title: '',
            tags: [],
            summary: '',
            description: '',
            department: {label: "Academic Senate", value: "5c4ab51421e1383889614c73"},
            deadline: new Date(),
            owner: this.props.auth.cruzid,
        })

        this.props.onSubmit()
    }

    onCancel = (e) => {
        e.preventDefault();
        this.setState({
            title: '',
            tags: [],
            summary: '',
            description: '',
            department: {label: "Academic Senate", value: "5c4ab51421e1383889614c73"},
            deadline: new Date(),
            owner: this.props.auth.cruzid,
        })

        this.props.onSubmit()
    };

    tagsChange = (new_tags) => {
        console.log(new_tags)
        this.setState({tags: new_tags},  () => {
            console.log(this.state.tags);
        });
        
    }

    render() {
        if (!this.props.auth.isProfessor) {
            this.props.history.push("/");
            return "";
        }

        return (
            <form>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input name="title" className="input" type="text" placeholder="Title" value={this.state.title} onChange={e => this.change(e)}></input>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Department</label>
                    <div className="control">
                        <div className="Select">
                            <Select options={departmentList} name="department" value={this.state.department} onChange={e => this.changeDept(e)} />                        
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Summary</label>
                    <div className="control">
                        <textarea name="summary" className="textarea" maxLength="150" placeholder="Summary, 150 char limit" value={this.state.summary} onChange={e => this.change(e)}></textarea>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                        <textarea name="description" className="textarea" placeholder="Description" value={this.state.description} onChange={e => this.change(e)}></textarea>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Tags</label>
                    <div className="control">
                       <Tags tagsChange={this.tagsChange} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Deadline</label>
                    <div className="control">
                        <Calendar
                            onChange={this.onChange}
                            value={this.state.date}
                        />
                        {/* <input name="deadline" className="input" type="date" value={this.state.deadline} onChange={e => this.change(e)}></input> */}
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button onClick={e => this.onSubmit(e)} className="button is-link">Submit</button>
                    </div>
                    <div className="control">
                        <button onClick={e => this.onCancel(e)} className="button is-link">Cancel</button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
}

export default withRouter(connect(mapStateToProps)(AddPostForm));
