import axios from 'axios';
import React from 'react';

export default class Form extends React.Component {
    state = {
        title: '',
        tags: '',
        description: '',
        department: '',
        deadline: '',
    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    getUser() {
        
    };

    getDepartment() {
        
    };

    onSubmit = (e) => {
        e.preventDefault();
        var r_tags = this.state.tags.split(',');
        for (var i = 0; i < r_tags.length; i++) {
            r_tags[i].replace(/\n|\r/g, "");
        }

        axios.post('/api/research_post', (req, res) => {
            //send stuff
            res.send(this.state);
        });

        

        console.log(this.state);
        this.setState({
            title: '',
            tags: '',
            description: '',
            department: '',
            deadline: '',
        })
    };

    render() {
        return (
            <form>
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input name="title" class="input" type="text" placeholder="Text input" value={this.state.title} onChange={e => this.change(e)}></input>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Department</label>
                    <div class="control">
                        <div class="select">
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

                <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <textarea name="description" class="textarea" placeholder="Textarea" value={this.state.description} onChange={e => this.change(e)}></textarea>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Tags</label>
                    <div class="control">
                        <input name="tags" class="input" type="text" placeholder="Text input" value={this.state.tags} onChange={e => this.change(e)}></input>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Deadline</label>
                    <div class="control">
                        <input name="deadline" class="input" type="date" value={this.state.deadline} onChange={e => this.change(e)}></input>
                    </div>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <button onClick={e => this.onSubmit(e)} class="button is-link">Submit</button>
                    </div>
                    <div class="control">
                        <button class="button is-text">Cancel</button>
                    </div>
                </div>
            </form>
        )
    }
}