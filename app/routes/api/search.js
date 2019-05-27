const express = require('express');

const router = express.Router();

// Schemas
const Research = require('../../models/Research');
const Department = require('../../models/Department');
const Application = require('../../models/Application');
const FacultyMember = require('../../models/FacultyMember');
const User = require('../../models/User');

// Search through users and return relevant data
async function searchUsers(name) {
  const users = await User.find({
    name: {
      $regex: name.toLowerCase(),
      $options: 'i',
    },
  });

  return users;
}

// Used for department search
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
    })
    .populate('owner')
    .populate('department')
    .populate('applicants');;

    await relevantPosts.then((posts) => {
      ret = posts;
    });
  });

  return ret;
}

// Used for Professor Search
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
    })
    .populate('owner')
    .populate('department')
    .populate('applicants');;

    await relevantPosts.then((posts) => {
      ret = posts;
    });
  });

  return ret;
}

// Search for relevant titles
async function searchTitle(name) {
  const relevantPosts = Research.find({
    title: {
      $regex: name.toLowerCase(),
      $options: 'i',
    },
  })
  .populate('owner')
  .populate('department')
  .populate('applicants');

  let ret;

  await relevantPosts.then((data) => {
    ret = data;
  });

  return ret;
}

// Search using a cruzid
async function searchCruzID(name) {
  let relevantFaculty = FacultyMember.find({
      'cruzid': {
          '$regex': name.toLowerCase(),
          $options: 'i'
      }
  });

  var ret;

  await relevantFaculty.then(async (data) => {
      let facIDs = []
      for (let i = 0; i < data.length; i++) {
          facIDs.push(data[i]._id);
      }

      let relevantPosts = Research.find({
          'owner': facIDs
      })
      .populate('owner')
      .populate('department')
      .populate('applicants');

      await relevantPosts.then((posts) => {
          ret = posts;
      });
  });

  return ret;
}

// Used privately for looking for applicants
async function searchApplicant(studentID) {
  let apIDs = []
  await Research.find()
  .populate('owner')
  .populate('department')
  .populate('applicants')
  .then(async research => {
    for(let i = 0; i < research.length; i++)
    {
      let promises = []
      for(let j = 0; j < research[i].applicants.length; j++)
      {
        promises.push(Application.findById(research[i].applicants[j]).populate('student'));
      }
      
      await Promise.all(promises).then(async applications => {
        for(let x = 0; x < applications.length; x++)
        {
          if (!applications[x].student) {
            continue;
          }

          if(applications[x].student.cruzid.toString() === studentID.toString() && applications[x].status.toString() === "accepted")
          {
              apIDs.push(research[i]);
              break;
          }
        }
      });
    }
  });

  return apIDs;
}

// Used for searching for relevant tags
async function searchTags(name) {
  const relevantPosts = [];

  const allResearch = Research.find()
  .populate('owner')
  .populate('department')
  .populate('applicants');

  let posts = [];
  await allResearch.then((data) => {
    posts = data;
  });

  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < posts[i].tags.length; j++) {
      if (name.toLowerCase().localeCompare(posts[i].tags[j].toLowerCase()) === 0) {
        relevantPosts.push(posts[i]);
      }
    }
  }

  return relevantPosts;
}

// @route GET api/search
// @desc  GET relevant search results
// @access Public
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
    case "Applicants":
      searchApplicant(req.query.query)
      .then((data) => {
          res.send(data);
      })
      .catch((err) => {
          console.log(err);
      });
      break;
    case "cruzid":
      searchCruzID(req.query.query)
      .then((data) => {
          res.send(data);
      })
      .catch((err) => {
          console.log(err);
      });
      break;
    case "User":
      searchUsers(req.query.query)
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

      
      // For default search only add relevant post once
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
