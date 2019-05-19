const express = require('express');

const router = express.Router();

const FacultyMember = require('../../models/FacultyMember');

router.get('/', async (req, res) => {
  if (req.query.cruzid !== undefined) {
    const relevantFaculty = FacultyMember.findOne({
      cruzid: {
        $regex: req.query.cruzid,
        $options: 'i',
      },
    });
    await relevantFaculty.then(async (facultyMember) => {
      res.send(facultyMember);
    });
  } else if (req.query.id !== undefined) {
    FacultyMember.findById(req.query.id)
      .then((faculty) => {
        if (faculty !== null) {
          res.send(faculty);
        } else {
          res.send({ faculty: { name: 'Invalid Faculty ID' } });
        }
      })
      .catch(err => res.status(404).json({ success: true }));
  } else {
    FacultyMember.find()
      .sort({ date: -1 })
      .then(faculty => res.json(faculty));
  }
});

router.post('/', (req, res) => {
  console.log(req.body)
  if (!req.body.isAdmin) {
    res.send(null);
    return;
  }

  if (req.body.cruzid && req.body.name) {
    console.log("Im in the if statement")
    FacultyMember.updateOne(
      { cruzid: req.body.cruzid },
      {
        cruzid: req.body.cruzid,
        name: req.body.name,
        // $inc:  {__v: 1}
      },
      { upsert: true }
    ).then(research => res.json(research));
  }
});

module.exports = router;
