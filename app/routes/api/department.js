const express = require('express');
const router = express.Router();

const Department = require('../../models/Department');

router.get('/', (req, res) => {
    Department.find()
        .then(research_posts => res.json(research_posts))
});

router.post('/', (req, res) => {
    const department = new Department({
        name: req.body.title,
    })

    department.save().then(research => res.json(research));
});

router.delete('/:id', (req, res) => {
    Department.findById(req.params.id)
        .then(research => research.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: true}));
});

module.exports = router;