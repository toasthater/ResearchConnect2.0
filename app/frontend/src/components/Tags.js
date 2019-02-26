import React from 'react';

const ENTER_KEY = 13;
const COMMA_KEY = 188;
const BACKSPACE_KEY = 8;


class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: [], value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
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

    tag = tag.replace(/,/g, "");

    if (!tag) {
      return;
    }

    this.setState({
      tags: [...tags, tag],
      value: ""
    });
  }

  editPrevTag() {
    let { tags } = this.state;

    const tag = tags.pop();

    this.setState({ tags, value: tag });
  }

  render() {
    const { tags, value } = this.state;
    return (
      <div className="form">
        <div className="tags">
          <ul>
            {tags.map((tag, i) => (
              <li key={tag + i} className="tag">
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
          Press <code>enter</code> or <code>,</code> to add a tag. Press{" "}
          <code>backspace</code> to edit previous tag.
        </small>
      </div>
    );
  }
}

export default Tags;

