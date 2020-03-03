import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Calendar from 'react-calendar';
import Select from 'react-select';
import Tags from './Tags';
import * as actions from '../actions';

class AddPostForm extends React.Component {
    state = {
        title: '',
        tags: [],
        reqSkills: [],
        prefSkills: [],
        summary: '',
        description: '',
        department: { label: 'Computer Science and Engineering', value: '5c4ab51421e1383889614c73' },
        deadline: new Date(),
        owner: this.props.auth.cruzid,
        valid: false,
        questions: [],
        departmentList: [],
    }

    componentDidMount() {
        if (this.props.post && this.props.post.owner.cruzid === this.props.auth.cruzid) {
            this.setState({
                _id: this.props.post._id,
                title: this.props.post.title,
                tags: this.props.post.tags,
                reqSkills: this.props.post.reqSkills,
                prefSkills: this.props.post.prefSkills,
                summary: this.props.post.summary,
                description: this.props.post.description,
                department: {
                    label: this.props.post.department.name,
                    value: this.props.post.department._id,
                },
                deadline: new Date(this.props.post.deadline),
                questions: this.props.post.questions,
                owner: this.props.post.owner.cruzid,
            });

            this.props.savePost(null);
        }

        let rawDepartmentList;
        const departmentList = [];
        function populateList(list) {
            for (let i = 0; i < list.length; i++) {
                const id = list[i]._id;
                const { name } = list[i];

                departmentList.push({ label: name, value: id });
            }
        }

        axios.get('/api/department').then((response) => {
            rawDepartmentList = response.data;
            populateList(rawDepartmentList);
            this.setState({
                departmentList,
            });
        });

    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    // for calendar change
    onChange = deadline => this.setState({ deadline })

    changeQuestion = (e) => {
        e.persist();
        this.setState(state => {
            const questions = state.questions;
            questions[parseInt(e.target.name)] = e.target.value;

            return { questions };
        });
    }

    changeDept = (e) => {
        this.setState({
            department: e,
        });
    };

    validate() {
        const { title, summary, description } = this.state;
        if (/\S/.test(title) && /\S/.test(summary) && /\S/.test(description)) {
            for (let i = 0; i < this.state.questions.length; i++) {
                if (!/\S/.test(this.state.questions[i])) {
                    return;
                }
            }

            this.setState({
                valid: true
            });
        }
    }

    async onSubmit(e) {
        e.preventDefault();
        await this.validate();
        if (this.state.valid === true) {
            await axios.post('/api/research_posts', { ...this.state });
            // console.log(this.state);
            this.setState({
                title: '',
                tags: [],
                reqSkills: [],
                prefSkills: [],
                summary: '',
                description: '',
                department: { label: 'Academic Senate', value: '5c4ab51421e1383889614c73' },
                deadline: this.state.deadline,
                owner: this.props.auth.cruzid,
                cruzid: this.props.auth.cruzid,
                questions: [],
                valid: false
            })

            this.props.onSubmit()
        } else alert('Title, Summary and Description are required fields. Questions may not be blank.');
    }

    onCancel = (e) => {
        e.preventDefault();
        this.setState({
            title: '',
            tags: [],
            reqSkills: [],
            prefSkills: [],
            summary: '',
            description: '',
            department: { label: 'Academic Senate', value: '5c4ab51421e1383889614c73' },
            deadline: new Date(),
            owner: this.props.auth.cruzid,
            cruzid: this.props.auth.cruzid,
            questions: [],
            valid: false
        });

        this.props.onSubmit();
    };

    addQuestion = (e) => {
        e.preventDefault();

        this.setState({ questions: [...this.state.questions, ""] });
    }

    removeQuestion = (e) => {
        e.preventDefault();

        if (this.state.questions.length > 0) {
            this.setState(state => {
                const questions = state.questions;
                questions.pop();

                return { questions };
            });
        }
    }

    getQuestions = () => {
        var questions = this.state.questions.map((question, i) =>
            <input type="text" key={i} name={i} autoFocus className="input" placeholder={"Question #" + (i + 1)} value={this.state.questions[i]} onChange={e => this.changeQuestion(e)} style={{ marginBottom: "1em" }}></input>
        );

        return <div>{questions}</div>
    }

    // These two functons are to handle changes to the Tags input for Tags
    tagsChange = (new_tags) => {
        // console.log(new_tags);
        this.setState({ tags: new_tags }, () => {
            // console.log(this.state.tags);
        });
    }
    getTags = () => this.state.tags


    // These two functons are to handle changes to the Tags input for required skills
    reqSkillsChange = (new_skills) => {
        // console.log(new_skills);
        this.setState({ reqSkills: new_skills }, () => {
            // console.log(this.state.reqSkills);
        });
    }
    getReqSkills = () => this.state.reqSkills

    // These two functons are to handle changes to the Tags input for preferred skills
    prefSkillsChange = (new_skills) => {
        // console.log(new_skills);
        this.setState({ prefSkills: new_skills }, () => {
            // console.log(this.state.prefSkills);
        });
    }
    getPrefSkills = () => this.state.prefSkills

    render() {
        if (!this.props.auth.isProfessor) {
            this.props.history.push('/');
            return '';
        }

        const { departmentList } = this.state;

        return (
            <form>
                <div className="field" align="center">
                    <label className="label">Title</label>
                    <div className="control">
                        <input name="title" className="input" type="text" maxLength="50" placeholder="Title, 50 char limit" value={this.state.title} onChange={e => this.change(e)} />
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Department</label>
                    <div className="control">
                        <div className="Select">
                            <Select options={departmentList} name="department" value={this.state.department} onChange={e => this.changeDept(e)} />
                        </div>
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Summary</label>
                    <div className="control">
                        <input type="text" name="summary" className="input" maxLength="150" placeholder="Summary, 150 char limit" value={this.state.summary} onChange={e => this.change(e)} />
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Description</label>
                    <div className="control">
                        <textarea name="description" className="textarea" placeholder="Description - Supports Markdown!" value={this.state.description} onChange={e => this.change(e)} />
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Required Skills</label>
                    <div className="control">
                        <Tags name="reqSkills" getTags={this.getReqSkills} tagsChange={this.reqSkillsChange} />
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Preferred Skills</label>
                    <div className="control">
                        <Tags name="prefSkills" getTags={this.getPrefSkills} tagsChange={this.prefSkillsChange} />
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Questionnaire</label>
                    <div className="control">
                        {this.getQuestions()}
                        <div className="columns" align="center">
                            <div className="column">
                                <button type="button" onClick={e => this.removeQuestion(e)} className="button is-danger is-outlined is-fullwidth">Remove Question</button>
                            </div>
                            <div className="column">
                                <button type="button" onClick={e => this.addQuestion(e)} className="button is-link is-fullwidth">Add Question</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Tags</label>
                    <div className="control">
                        <Tags name="tags" getTags={this.getTags} tagsChange={this.tagsChange} />
                    </div>
                </div>

                <div className="field" align="center">
                    <label className="label">Deadline</label>
                    <div align="center">
                        <Calendar
                            onChange={this.onChange}
                            value={this.state.deadline}
                        />
                        {/* <input name="deadline" className="input" type="date" value={this.state.deadline} onChange={e => this.change(e)}></input> */}
                    </div>
                </div>

                <div className="columns" align="center">
                    <div className="column">
                        <button type="button" onClick={e => this.onCancel(e)} className="button is-danger is-outlined is-fullwidth">Cancel</button>
                    </div>
                    <div className="column">
                        <button type="button" onClick={e => this.onSubmit(e)} className="button is-fullwidth is-link">Submit</button>
                    </div>
                </div>
            </form>
        );
    }
}

function mapStateToProps({ auth, post }) {
    return { auth, post };
}

export default withRouter(connect(mapStateToProps, actions)(AddPostForm));
