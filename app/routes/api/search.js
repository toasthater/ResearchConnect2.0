const express = require('express');

const router = express.Router();
const fillResearchPost = require('./fillResearchHelper');

// Schemas
const Research = require('../../models/Research');
const Department = require('../../models/Department');
const FacultyMember = require('../../models/FacultyMember');

async function searchDepartments(name) {
  const relevantDepartments = Department.find({
    name: {
      $regex: name.toLowerCase(),
      $options: 'i',
    },
  });

  let ret;

  await relevantDepartments.then(async (data) => {
    const deptIDs = [];
    for (let i = 0; i < data.length; i++) {
      deptIDs.push(data[i]._id);
    }

    const relevantPosts = Research.find({
      department: deptIDs,
    });

    await relevantPosts.then((posts) => {
      ret = posts;
    });
  });

  for (let i = 0; i < ret.length; i++) {
    ret[i] = await fillResearchPost(ret[i]);
  }

  return ret;
}

async function searchFaculty(name) {
  const relevantFaculty = FacultyMember.find({
    name: {
      $regex: name.toLowerCase(),
      $options: 'i',
    },
  });

  let ret;

  await relevantFaculty.then(async (data) => {
    const facIDs = [];
    for (let i = 0; i < data.length; i++) {
      facIDs.push(data[i]._id);
    }

    const relevantPosts = Research.find({
      owner: facIDs,
    });

    await relevantPosts.then((posts) => {
      ret = posts;
    });
  });

  for (let i = 0; i < ret.length; i++) {
    ret[i] = await fillResearchPost(ret[i]);
  }

  return ret;
}

async function searchTitle(name) {
  const relevantPosts = Research.find({
    title: {
      $regex: name.toLowerCase(),
      $options: 'i',
    },
  });

  let ret;

  await relevantPosts.then((data) => {
    ret = data;
  });

  for (let i = 0; i < ret.length; i++) {
    ret[i] = await fillResearchPost(ret[i]);
  }

  return ret;
}

async function searchTags(name) {
  const relevantPosts = [];

  const allResearch = Research.find();

  let posts = [];
  await allResearch.then((data) => {
    posts = data;
  });

  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < posts[i].tags.length; j++) {
      if (name.toString().localeCompare(posts[i].tags[j].toString()) === 0) {
        relevantPosts.push(await fillResearchPost(posts[i]));
      }
    }
  }

  return relevantPosts;
}
router.get('/', (req, res) => {
  switch (req.query.type) {
    case 'Department':
      searchDepartments(req.query.query)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
        });

      break;
    case 'Professor':
      searchFaculty(req.query.query)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
        });

      break;
    case 'Title':
      searchTitle(req.query.query)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
        });

      break;
    case 'Tag':
      searchTags(req.query.query)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
        });

      break;
    default:
      var promises = [
        searchDepartments(req.query.query),
        searchFaculty(req.query.query),
        searchTitle(req.query.query),
      ];

      Promise.all(promises).then((data) => {
        const posts = [];

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            let inArray = false;
            for (const post of posts) {
              if (post._id.toString().localeCompare(data[i][j]._id.toString()) === 0) {
                inArray = true;
                break;
              }
            }

            if (!inArray) posts.push(data[i][j]);
          }
        }

        res.send(posts);
      })
        .catch((err) => {
          console.log(err);
        });

      break;
  }
});

module.exports = router;
