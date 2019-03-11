const express = require('express');
const router = express.Router();

//Research post model
const Research = require('../../models/Research');
const FacultyMember = require('../../models/FacultyMember');
const Department = require('../../models/Department');
const Application = require('../../models/Application');
const User = require('../../models/User');

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
        FacultyMember.findById(result.owner, (err, owner) => {
          if (err) {
            console.log(err);
            res.send(new Research());
          } else {
            Department.findById(result.department, (err, department) => {
              if (err) {
                console.log(err);
                res.send(new Research());
              } else {
                result.owner = owner;
                result.department = department;
                
                if (result.applicants === null || result.applicants.length === 0) {
                  res.send(result);
                  return;
                }

                for (let i = 0; i < result.applicants.length; i++) {
                  Application.findById(result.applicants[i], (err, applicant) => {
                    if (err) {
                      console.log(err);
                      res.send(new Research());
                    } else {
                      User.findById(applicant.student, (err, student) => {
                        if (err) {
                          console.log(err);
                          res.send(new Research());
                        } else {
                          result.applicants[i] = applicant.toJSON();
                          result.applicants[i].student = student;

                          if (i === result.applicants.length - 1) {
                            res.send(result);
                          }
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      } else {
          res.send(result);
      }
    });
  } else {
    Research.find({})
      .sort({ date : -1  }).limit(9)
      .then(research_posts => res.json(research_posts));
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