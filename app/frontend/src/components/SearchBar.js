import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/searchbar.scss';
import { fetchPosts, fetchDepartments, fetchFaculty, searchPosts } from '../actions/index';



class SearchBar extends Component {
    dropdownClicked() {
      const dropdown = document.querySelector(".dropdown-items");
      if (dropdown.hasAttribute("style"))
      {
        dropdown.removeAttribute("style");
      }
      else
      {
        dropdown.setAttribute("style", "display: none");
      }
    }

    itemClicked(item) {
      document.querySelector(".dropdown-trigger").innerHTML = item;
      this.dropdownClicked();
    }

    handleSubmit(e) {
      e.preventDefault();

      let type = document.querySelector(".dropdown-trigger").innerHTML;
      let query = document.querySelector(".input").value;
      searchPosts(type, query)();

      /*fetchDepartments()()
      .then(data => {
        var departments = data;

        fetchFaculty()()
        .then(data => {
          var faculty = data;

          fetchPosts()()
          .then(data => {
            let type = document.querySelector(".dropdown-trigger").innerHTML;
            let query = document.querySelector(".input").value;

            let relevantDepartments = departments.filter(dept => dept.name.toLowerCase().includes(query.toLowerCase()));
            let relevantFaculty = faculty.filter(fac => fac.name.toLowerCase().includes(query.toLowerCase()));

            let relevantPosts = data.filter(post => {
              switch (type)
              {
                case "Department":
                  for (let i = 0; i < relevantDepartments.length; i++)
                  {
                    if (relevantDepartments[i]._id === post.department)
                    {
                      return true;
                    }
                  }

                  return false;
                case "Title":
                  return post.title.toLowerCase().includes(query.toLowerCase());
                case "Professor": 
                default:
                  return true;
              }
            });

            console.log(relevantPosts);
          })
          .catch(err => console.log(err));
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));*/
    }

    render() {
        return(
            <div>
              <section className="section">
                <div className="container">
                  <div className="control">
                    <span className="dropdown-trigger" onClick={this.dropdownClicked}>Default</span> 
                    <ul className="box dropdown-items" style={{display: 'none'}}>
                      <li className="dropdown-item" onClick={() => this.itemClicked("Default")}>Default</li>
                      <li className="dropdown-item" onClick={() => this.itemClicked("Department")}>Department</li>
                      <li className="dropdown-item" onClick={() => this.itemClicked("Professor")}>Professor</li>
                      <li className="dropdown-item" onClick={() => this.itemClicked("Title")}>Title</li>
                    </ul> 
                  </div>
                </div>
              </section>
              <form onSubmit={(e) => this.handleSubmit(e)}>
                <input type="text" className="input" id="searchbar" placeholder="Search" />
              </form>
            </div>
        )
    }
}

export default connect()(SearchBar);