const express = require('express');
const router = express.Router();

//Research post model
const Research = require('../../models/Research');

// @route GET api/research_posts
// @desc  Get all research posts
// @access Public
router.get('/', (req, res) => {
    Research.find()
        .sort({ date : -1  })
        .then(research_posts => res.json(research_posts))
});

// @route POST api/research_posts
// @desc  Create a research post
// @access Public
router.post('/', (req, res) => {
    console.log(req.body);
    const researchPost = new Research({
        title: req.body.title,
        owner: req.body.owner, // Junecue Suh, Pat Mantey
        tags: req.body.r_tags, // [linear, algebra], ["pure, research"]
        description: req.body.description, // I am math teacher, I sponser this project
        department: req.body.department, // Mathematics, CE
        status: "Open",
        deadline: req.body.deadline
    });

    researchPost.save().then(research => res.json(research));
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