const express = require('express');

const router = express.Router();
const fillResearchPost = require('./fillResearchHelper');


// Research post model
const Research = require('../../models/Research');
const FacultyMember = require('../../models/FacultyMember');

// @route GET api/research_posts
// @desc  Get all research posts
// @access Public
router.get('/', (req, res) => {
  if (req.query.id) {
    Research.findById(req.query.id, (err, result) => {
      if (err) {
        console.log(err);
        res.send(new Research());
      } else if (req.query.fill) {
        fillResearchPost(result)
          .then(data => res.send(data))
          .catch(err => res.send(new Research()));
      } else {
        res.send(result);
      }
    });
  } else {
    Research.find({})
      .populate('owner')
      .populate('department')
      .populate('applicants')
      .sort({ date: -1 }).limit(9)
      .then(async (research_posts) => {
        var currentDate = new Date();
        var postsToClose = [];

        research_posts.forEach(function (post) {
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
        res.send(research_posts);
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
