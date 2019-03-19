import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Calendar from 'react-calendar';
import Select from 'react-select';
import Tags from './Tags';
import * as actions from '../actions';

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
        valid: false,
    }

    componentDidMount() {
        if (this.props.post && this.props.post.owner.cruzid === this.props.auth.cruzid) {
            this.setState({
                _id: this.props.post._id,
                title: this.props.post.title,
                tags: this.props.post.tags,
                summary: this.props.post.summary,
                description: this.props.post.description,
                department: {
                    label: this.props.post.department.name,
                    value: this.props.post.department._id
                },
                deadline: new Date(this.props.post.deadline),
                owner: this.props.post.owner.cruzid,
            });

            this.props.savePost(null);
        }
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

    validate() {
        const {
            title,
            summary,
            description
          } = this.state;
        if(/\S/.test(title) && /\S/.test(summary) && /\S/.test(description))
            this.setState({
                valid:true
            })
      }

    async onSubmit(e) {
        e.preventDefault();
        await this.validate()
        if (this.state.valid === true){
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
                cruzid: this.props.auth.cruzid,
                valid: false,
            })

            this.props.onSubmit()
        }
        else
            alert('Title, Summary and Description are required fields.');
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
            cruzid: this.props.auth.cruzid,
            valid:false
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
            <form >
                <div className="container" style={{ width: 768 , marginTop: "5em" }}>
                    <div className="field" align="center">
                        <label className="label">Title</label>
                        <div className="control">
                            <input name="title" className="input" type="text" maxLength="50" placeholder="Title, 50 char limit" value={this.state.title} onChange={e => this.change(e)}></input>
                        </div>
                    </div>

                    <div className="field" align="center">
                        <label className="label">Department</label>
                        <div className="control">
                            <div className="Select">
                                <Select options={departmentList} name="department" value={this.state.department} onChange={e => this.changeDept(e)}/>                        
                            </div>
                        </div>
                    </div>

                    <div className="field" align="center">
                        <label className="label">Summary</label>
                        <div className="control">
                            <textarea name="summary" className="textarea" maxLength="150" placeholder="Summary, 150 char limit" value={this.state.summary} onChange={e => this.change(e)}></textarea>
                        </div>
                    </div>

                    <div className="field" align="center">
                        <label className="label">Description</label>
                        <div className="control">
                            <textarea name="description" className="textarea" placeholder="Description" value={this.state.description} onChange={e => this.change(e)}></textarea>
                        </div>
                    </div>

                    <div className="field" align="center">
                        <label className="label">Tags</label>
                        <div className="control">
                        <Tags tagsChange={this.tagsChange} />
                        </div>
                    </div>

                    <div className="field" align="center">
                        <label className="label">Deadline</label>
                        <div  align="center">
                            <Calendar 
                                onChange={this.onChange}
                                value={this.state.deadline}
                            />
                            {/* <input name="deadline" className="input" type="date" value={this.state.deadline} onChange={e => this.change(e)}></input> */}
                        </div>
                    </div>

                    <div className="columns" align="center">
                        <div className="column"> 
                            <button onClick={e => this.onCancel(e)} className="button is-danger is-link">Cancel</button>
                        </div>
                        <div className="column">
                            <button onClick={e => this.onSubmit(e)} className="button is-link">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps({ auth, post }){
    return { auth, post };
}

export default withRouter(connect(mapStateToProps, actions)(AddPostForm));
