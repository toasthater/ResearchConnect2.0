import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import DepartmentImage from './DepartmentImage';


class PostCard extends PureComponent {
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
                                    <p className="subtitle is-6">{post.professor}</p>
                                </div>
                            </div>
                            
                            <div className="content">
                                <span className="tag is-primary is-medium is-pink-bc is-centered">{post.department}</span>
                                <br /><br />
                                {post.summary}
                                <br /><br />
                                <div className="tags">
                                {post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))}
                                </div>
                                <br />
                            </div>
                        </div>
                        
                        <footer className="card-footer">
                            <a className="card-footer-item info" onClick={() => this.props.history.push(`/post?id=${post.id}`)}>
                                Learn More
                            </a>
                            <a className="card-footer-item is-link">
                                Apply
                            </a>
                        </footer>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default withRouter(PostCard);