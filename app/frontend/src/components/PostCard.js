import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import DepartmentImage from './DepartmentImage';


class PostCard extends PureComponent {
    getApplicants() {
        var applicants = this.props.post.applicants;
        return (
        <div className="flex item inner content">
            {applicants.map(applicant =>
                <div key={applicant}>
                    <Link className="subtitle is-6 has-text-link" to={"/profile/" + applicant}>{applicant}</Link>
                    <br />
                </div>)}
        </div>)
    }

    render() {
        const post = this.props.post;
        return(
        <div key={post.id} className="flex-item">
            <div className="flex-item-inner">
                <div className="flex-item-inner-content">
                    <div className="card rounded">
                        <div className="card-content">
                            <div className="card-img-top">
                                <div className="circle">
                                    <div>
                                        <DepartmentImage type={post.type} />
                                    </div>
                                </div>
                            </div>
                            <div className="media">
                                <div className="media-content">
                                    <p className="title is-5">{post.name}</p>
                                    <Link className="subtitle is-6 has-text-link" to={post.ownerProfile}>{post.professor}</Link>
                                </div>
                            </div>
                            
                            <div className="content">
                                <span className="tag is-primary is-medium is-pink-bc is-centered">{post.department}</span>
                                <br /><br />
                                {post.summary}
                                <div className="tags-section">
                                {/* {post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))} */}
                                </div>
                            </div>
                        </div>
                        
                        {this.props.post.applicants && this.getApplicants()}

                        <footer className="card-footer">
                            <Link className="card-footer-item info" to={`/post?id=${post.id}`}>
                                Learn More
                            </Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default withRouter(PostCard);