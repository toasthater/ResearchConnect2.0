const express = require('express');
const router = express.Router();
const fillResearchPost = require('./fillResearchHelper');

//Research post model
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
      .sort({ date : -1  }).limit(9)
      .then(async research_posts => {
        if (req.query.fill) {
          for (let i = 0; i < research_posts.length; i++) {
            research_posts[i] = await fillResearchPost(research_posts[i]);
          }
        }

        res.send(research_posts);
      })
      .catch(err => res.send([new Research()]));
  }
});

// @route POST api/research_posts
// @desc  Create a research post
// @access Public
router.post('/', (req, res) => {
    let relevantFaculty = FacultyMember.findOne({
        'cruzid': {
            '$regex': req.body.owner.toLowerCase(),
            $options: 'i'
        }
    });

    relevantFaculty.then(data => {
      const researchPost = new Research({
        title: req.body.title,
        owner: data._id,
        tags: req.body.tags,
        summary: req.body.summary,
        description: req.body.description,
        department: req.body.department.value,
        status: "Open",
        deadline: req.body.deadline
      });

    researchPost.save().then(research => res.json(research));
    });
});

// @route DELETE api/research_posts/:id
// @desc  Delete a research post
// @access Public
router.delete('/:id', (req, res) => {
    Research.findById(req.params.id)
        .then(research => research.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: true}));
});

module.exports = router;