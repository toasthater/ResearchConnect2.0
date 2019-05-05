const express = require('express');

const router = express.Router();
const fillResearchPost = require('./fillResearchHelper');

// Schemas
const Research = require('../../models/Research');
const Department = require('../../models/Department');
const Application = require('../../models/Application');
const FacultyMember = require('../../models/FacultyMember');
const User = require('../../models/User');

async function searchUsers(name) {
  const user = await User.findOne({
    name: {
      $regex: name.toLowerCase(),
      $options: 'i',
    },
  });

  if (!user) {
    return null;
  }

  return user.cruzid;
}

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

  async function searchApplicant(studentID) {
    let apIDs = []
    await Research.find()
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
                apIDs.push(await fillResearchPost(research[i]));
                break;
            }
          }
        });
      }
    });

    return apIDs;
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
