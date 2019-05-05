import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import DepartmentImage from './DepartmentImage';


class PostCard extends PureComponent {
  render() {
    const { post } = this.props;
    return (
      <div key={post.id} className="card" style={{ borderRadius: '5px', marginBottom: '2.5em' }}>
        <div className="card-image has-text-centered" style={{ top: '-1em' }}>
          <figure className="image is-128x128" style={{ display: 'inline-block' }}>
            <DepartmentImage type={post.type} />
          </figure>
        </div>
        <div className="card-content" style={{ paddingTop: '0px' }}>
          <p className="title is-4">{ post.name }</p>
          <p className="subtitle is-6">
            by <Link className="has-text-link" to={post.ownerProfile}>{post.professor}</Link>
          </p>
          <div className="content">
            { post.summary }
          </div>
          <div className="tag is-info" style={{ margin: '0.25em 0px' }}>{ post.department }</div>
        </div>
        <footer className="card-footer">
          <Link className="card-footer-item has-text-success" to={`/post?id=${post.id}`}>
            Learn More
          </Link>
        </footer>
      </div>
    );
    return (
      <div key={post.id} className="column is-one-third">
        <div className="box">
          <article className="media" style={{ alignItems: 'center' }}>
            <div className="media-left">
              <figure className="image is-128x128">
                <DepartmentImage type={post.type} />
              </figure>
            </div>
            <div className="media-content">
              <div className="content">
                <p>
                  <strong>{ post.name }</strong> <small>by <Link className="subtitle is-6 has-text-link" to={post.ownerProfile}>{post.professor}</Link></small>
                  <br />
                  <div className="tag is-primary" style={{ margin: '0.25em 0px' }}>{ post.department }</div>
                  <br />
                  { post.summary }
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
    // return (
    //   <div className="flex-item">
    //     <div className="flex-item-inner">
    //       <div className="flex-item-inner-content">
    //         <div className="card rounded">
    //           <div className="card-content">
    //             <div className="card-img-top">
    //               <div className="circle">
    //                 <div>
    //
    //                 </div>
    //               </div>
    //             </div>

    //           <footer className="card-footer">
                // <Link className="card-footer-item info" to={`/post?id=${post.id}`}>
                //                 Learn More
                // </Link>
    //           </footer>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

export default withRouter(PostCard);
