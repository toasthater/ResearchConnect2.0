const express = require('express');
const router = express.Router();

const Student = require('../../models/Student');

router.get('/', async (req, res) => {
    let relevantStudents = Student.find({
            'cruzid': {
                '$regex': req.query.cruzid,
                $options: 'i'
            }
        });
    await relevantStudents.then(async (student) => {
        res.send(student);
    });
});

router.delete('/:id', (req, res) => {
    Student.findById(req.params.id)
        .then(research => research.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: true}));
});

module.exports = router;