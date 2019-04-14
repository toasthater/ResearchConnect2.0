import React from 'react';
import { connect } from 'react-redux';

const ENTER_KEY = 13;
const COMMA_KEY = 188;
const BACKSPACE_KEY = 8;


class Tags extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    let temp = [];
    if (this.props.post) {
      temp = this.props.post.tags;
    }

    this.state = { tags: temp, value: '', props };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(e) {
    console.log(this.state);
    this.setState({
      value: e.target.value,
    });
  }

  handleKeyUp(e) {
    const key = e.keyCode;

    if (key === ENTER_KEY || key === COMMA_KEY) {
      this.addTag();
    }
  }

  handleKeyDown(e) {
    const key = e.keyCode;
    if (key === BACKSPACE_KEY && !this.state.value) {
      this.editPrevTag();
    }
  }

  addTag() {
    const { tags, value } = this.state;
    let tag = value.trim();

    tag = tag.replace(/,/g, '');

    if (!tag) {
      return;
    }

    if (this.state.tags.indexOf(tag) != -1) {
      alert("This tag already exists");
      this.setState({
        value: '',
      }, () => {
        this.props.tagsChange(this.state.tags);
      });
    }
    else {
      this.setState({
        tags: [...tags, tag],
        value: '',
      }, () => {
        this.props.tagsChange(this.state.tags);
      });
    }
  }

  editPrevTag() {
    const { tags } = this.state;

    const tag = tags.pop();

    this.setState({ tags, value: tag });
  }

  render() {
    const { tags, value } = this.state;
    return (
      <div className="form">
        <div className="tags_in">
          <ul>
            {tags.map((tag, i) => (
              <li key={tag + i} className="tag_in">
                {tag}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add tag..."
            value={value}
            onChange={this.handleChange}
            ref="tag"
            className="tag-input"
            onKeyUp={this.handleKeyUp}
            onKeyDown={this.handleKeyDown}
          />
        </div>
        <small>
          Press
          {' '}
          <code>enter</code>
          {' '}
          or
          {' '}
          <code>,</code>
          {' '}
          to add a tag. Press
          {' '}
          <code>backspace</code>
          {' '}
          to edit previous tag.
        </small>
      </div>
    );
  }
}

function mapStateToProps({ post }) {
  return { post };
}

export default connect(mapStateToProps, null)(Tags);
