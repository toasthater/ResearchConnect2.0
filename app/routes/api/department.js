const express = require('express');
const router = express.Router();

const Department = require('../../models/Department');

router.get('/', (req, res) => {
    if (req.query.id === undefined)
    {
        Department.find()
        .then(research_posts => res.json(research_posts));
        return;
    }

    Department.findById(req.query.id)
    .then(department => res.send({department}))
    .catch(err => res.status(404).json({success: true}));
});

module.exports = router;