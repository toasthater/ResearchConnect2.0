const express = require('express');
const router = express.Router();

const FacultyMember = require('../../models/FacultyMember');

router.get('/', (req, res) => {
    FacultyMember.find()
        .then(research_posts => res.json(research_posts))
});

router.post('/', (req, res) => {
    const facultymember = new FacultyMember({
        name: req.body.title,
        cruzid: req.body.title
    })
    facultymember.save().then(research => res.json(research));
});

router.delete('/:id', (req, res) => {
    FacultyMember.findById(req.params.id)
        .then(research => research.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: true}));
});

module.exports = router;