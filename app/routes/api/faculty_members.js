const express = require('express');
const router = express.Router();

const FacultyMember = require('../../models/FacultyMember');

router.get('/', async (req, res) => {
    if (req.query.cruzid !== undefined)
    {
        let relevantFaculty = FacultyMember.find({
                'cruzid': {
                    '$regex': req.query.cruzid,
                    $options: 'i'
                }
            });
        await relevantFaculty.then(async (facultyMember) => {
            res.send(facultyMember);
        });
    }
    else if (req.query.id !== undefined)
    {
        FacultyMember.findById(req.query.id)
        .then(faculty => {
            if (faculty !== null) {
                res.send(faculty);
            } else {
                res.send({ faculty : { name : "Invalid Faculty ID" }});
            }
        })
        .catch(err => res.status(404).json({success: true}));
    } else {
        FacultyMember.find()
          .sort({ date : -1  })
          .then(faculty => res.json(faculty));
    }
});

router.post('/', (req, res) => {
    const facultymember = new FacultyMember({
        name: req.body.name,
        cruzid: req.body.cruzid
    })
    facultymember.save().then(research => res.json(research));
});

router.delete('/:id', (req, res) => {
    FacultyMember.findById(req.params.id)
        .then(research => research.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: true}));
});

module.exports = router;