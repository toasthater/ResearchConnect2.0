import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';

class AddPostForm extends React.Component {
    state = {
        title: '',
        tags: '',
        description: '',
        department: 'Academic Senate',
        deadline: new Date(),
        owner: this.props.auth._id,
        r_tags: [],
    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    onChange = deadline => this.setState({ deadline })

    onSubmit = (e) => {
        e.preventDefault();
        this.state.r_tags = this.state.tags.split(',');
        for (var i = 0; i < this.state.r_tags.length; i++) {
            this.state.r_tags[i].replace(/\n|\r/g, "");
            this.state.r_tags[i] = this.state.r_tags[i].trim();
        }

        axios.post('/api/research_posts', { ...this.state });  

        console.log(this.state);
        this.setState({
            title: '',
            tags: '',
            description: '',
            department: 'Academic Senate',
            deadline: new Date(),
            owner: this.props.auth._id,
            r_tags: [],
        })

        this.props.onSubmit()
    };

    render() {
        return (
            <form>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input name="title" className="input" type="text" placeholder="Text input" value={this.state.title} onChange={e => this.change(e)}></input>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Department</label>
                    <div className="control">
                        <div className="select">
                            <select name="department" value={this.state.department} onChange={e => this.change(e)}>
                                <option>Academic Senate</option>
                                <option>History of Consciousness</option>
                                <option>American Studies</option>
                                <option>Anthropology</option>
                                <option>Applied Math &amp; Statistics</option>
                                <option>Earth &amp; Planetary Sciences</option>
                                <option>Art</option>
                                <option>Arts Division</option>
                                <option>Astronomy &amp; Astrophysics</option>
                                <option>Baskin School of Engineering</option>
                                <option>Computational Media</option>
                                <option>Electrical Engineering</option>
                                <option>Computer Engineering</option>
                                <option>Biological Sciences</option>
                                <option>Biomolecular Engineering</option>
                                <option>Biomolecular Science &amp; Engineering</option>
                                <option>Environmental Studies</option>
                                <option>Sociology</option>
                                <option>Psychology</option>
                                <option>Chemistry &amp; Biochemistry</option>
                                <option>Microbiology &amp; Environmental Toxicology</option>
                                <option>Latin American &amp; Latino Studies</option>
                                <option>Community Studies Program</option>
                                <option>Computer Science</option>
                                <option>Humanities Division</option>
                                <option>Physics</option>
                                <option>History of Art/Visual Culture</option>
                                <option>Literature</option>
                                <option>History</option>
                                <option>Feminist Studies</option>
                                <option>Crown College</option>
                                <option>Theater Arts</option>
                                <option>Digital Arts and New Media</option>
                                <option>Film and Digital Media</option>
                                <option>Ecology &amp; Evolutionary Biology</option>
                                <option>Institute of Marine Sciences</option>
                                <option>Economics</option>
                                <option>Education</option>
                                <option>Graduate Studies Division</option>
                                <option>Social Sciences Division</option>
                                <option>Ocean Sciences</option>
                                <option>Languages and Applied Linguistics</option>
                                <option>Politics</option>
                                <option>Legal Studies</option>
                                <option>Linguistics</option>
                                <option>Mathematics</option>
                                <option>Music</option>
                                <option>Philosophy</option>
                                <option>Physical &amp; Biological Sciences Division</option>
                                <option>Porter College</option>
                                <option>Program in Community &amp; Agroecology (PICA)</option>
                                <option>Santa Cruz Institute for Particle Physics (SCIPP)</option>
                                <option>Writing Program</option>
                                <option>Technology Management</option>
                                <option>UCSC Extension (UNEX)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                        <textarea name="description" className="textarea" placeholder="Textarea" value={this.state.description} onChange={e => this.change(e)}></textarea>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Tags</label>
                    <div className="control">
                        <input name="tags" className="input" type="text" placeholder="Text input" value={this.state.tags} onChange={e => this.change(e)}></input>
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
                        <button className="button is-text">Cancel</button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps({auth}){
    return { auth };
}

export default connect(mapStateToProps)(AddPostForm);