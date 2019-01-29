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