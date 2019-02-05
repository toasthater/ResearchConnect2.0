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
    const researchPost = new Research({
        title: req.body.title,
        owner: "5c4ab55a21e1383889614ec6", // Junecue Suh, Pat Mantey
        tags: ["pure", "research"], // [linear, algebra], ["pure, research"]
        description: "I sponser this project", // I am math teacher, I sponser this project
        department: "5c4ab51421e1383889614c7a", // Mathematics, CE
        status: "Open",
        deadline: new Date(2020, 2, 8)
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