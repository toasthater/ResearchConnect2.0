const express = require('express');
const router = express.Router();

// Research post model
const Research = require('../../models/Research');
const FacultyMember = require('../../models/FacultyMember');

// @route GET api/research_posts
// @desc  Get all research posts
// @access Public
router.get('/', (req, res) => {
  if (req.query.id) {
    var query = Research.findById(req.query.id);
    if (req.query.fill) {
      query = query
        .populate('owner')
        .populate('department')
        .populate({
          path: 'applicants',
          populate: {
            path: 'student',
          }
        });
    }

    query.then(result => {
      var currentDate = new Date();
      var postDate = new Date(result.deadline);
      if (result.status === 'Open' && currentDate > postDate) {
        result.status = 'Closed';
        Research.findByIdAndUpdate(result._id, {
          $set: {
            status: result.status
          }
        })
      }

      if (req.user.isProfessor) {
        res.send(result);
      }
      else {
        var filteredPost = result.toObject();
        delete filteredPost.applicants;

        res.send(filteredPost);
      }
    }).catch(err => {
      console.log(err);
      res.send(new Research());
    });
  } else {
    Research.find({})
      .populate('owner')
      .populate('department')
      .populate({
        path: 'applicants',
        populate: {
          path: 'student',
        }
      })
      .sort({ date: -1 }).limit(20)
      .then(async (research_posts) => {
        var currentDate = new Date();
        var postsToClose = [];
        var filteredPost = [];

        research_posts.forEach(function (post) {

          if (!req.user.isProfessor) {
            var tempPost = post.toObject();
            delete tempPost.applicants;

            filteredPost.push(tempPost);
          }

          var postDate = new Date(post.deadline);
          if (post.status === 'Open' && currentDate > postDate) {
            post.status = 'Closed';
            postsToClose.push(post);
          }
        })

        await Promise.all(
          postsToClose.map(function (post) {
            return Research.findByIdAndUpdate(post._id, {
              $set: {
                status: post.status
              }
            })
          })
        )

        if (req.user.isProfessor) {
          res.send(research_posts);
        } else {
          res.send(filteredPost);
        }
      })
      .catch(err => res.send([new Research()]));
  }
})


// @route POST api/research_posts
// @desc  Create a research post
// @access Public
router.post('/', (req, res) => {
  if (!req.user || req.body.owner !== req.user.cruzid) {
    res.send(null);
    return;
  }

  const relevantFaculty = FacultyMember.findOne({
    'cruzid': {
      $regex: req.body.owner.toLowerCase(),
      $options: 'i'
    }
  });

  relevantFaculty.then(data => {
    const researchPost = new Research({
      title: req.body.title,
      owner: data._id,
      cruzid: req.body.owner,
      tags: req.body.tags,
      reqSkills: req.body.reqSkills,
      prefSkills: req.body.prefSkills,
      summary: req.body.summary,
      description: req.body.description,
      department: req.body.department.value,
      status: req.body.status ? req.body.status : "Open",
      deadline: req.body.deadline,
      questions: req.body.questions
    });

    if (req.body._id) {
      Research.findByIdAndUpdate(req.body._id, {
        $set: {
          title: researchPost.title,
          owner: researchPost.owner,
          cruzid: researchPost.cruzid,
          tags: researchPost.tags,
          reqSkills: researchPost.reqSkills,
          prefSkills: researchPost.prefSkills,
          summary: researchPost.summary,
          description: researchPost.description,
          department: researchPost.department,
          status: researchPost.status,
          deadline: researchPost.deadline,
          questions: req.body.questions
        },
      }, (err, research) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send(research);
        }
      });
    } else {
      researchPost.save().then(research => res.json(research));
    }
  });
});

// @route DELETE api/research_posts/:id
// @desc  Delete a research post
// @access Public
router.delete('/', (req, res) => {
  if (!req.user || !req.query || !req.query.id) {
    res.send(null);
    return;
  }

  Research.findById(req.query.id)
    .then(research => {
      if (research.cruzid !== req.user.cruzid) {
        res.send(null);
        return;
      }

      research.remove().then(() => res.json({ success: true }))
    }).catch(err => res.status(404).json({ success: true }));
});

module.exports = router;
