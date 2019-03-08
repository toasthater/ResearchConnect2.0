import React, { PureComponent } from 'react';
import defaultPost from "../assets/defaultPost.png";
import globe from "../assets/globe.png";
import hammer from "../assets/hammer.png";
import brain from "../assets/brain.png";
import building from "../assets/building.png";
import graph from "../assets/graph.png";
import paint from "../assets/paint.png";
import atom from "../assets/atom.png";
import computer from "../assets/computer.png";
import leaf from "../assets/leaf.png";
import chemistry from "../assets/chemistry.png";
import drama from "../assets/drama.png";



class PostCard extends PureComponent {
    selectPostImage = (type) => {
        switch(type){
            case 1:
                return globe;
            case 2:
                return hammer;
            case 3:
                return brain;
            case 4:
                return building;
            case 5:
                return graph;
            case 6:
                return paint;
            case 7: 
                return atom;
            case 8:
                return computer;
            case 9:
                return leaf;
            case 10:
                return chemistry;
            case 11:
                return drama;
            default:
                return defaultPost;
        }
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
                                        <img src={this.selectPostImage(post.type)} alt="" class="post-icon" />
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
                                <span class="tag is-primary is-medium is-pink-bc is-centered">Computer Science</span>
                                <br /><br />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                                <br /><br />
                                <div className="tags">
                                {post.tags.map(tag => (<span className="tag is-medium" key={tag}>{tag}</span>))}
                                </div>
                                <br />
                            </div>
                        </div>
                        
                        <footer className="card-footer">
                            <a className="card-footer-item info">
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

export default PostCard;