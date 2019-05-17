const express = require('express');

const router = express.Router();
const Student = require('../../models/Student');

router.post('/', (req, res) => {
  if (!req.user || !req.user.isProfessor || !req.body.id || req.body.endorse == null) {
    res.send(null);
    return;
  }

  Student.findById(req.body.id)
  .then(student => {
    if (!student) {
      res.send(null);
      return;
    }

    if (!student.endorsements) {
      student.endorsements = [];
    }

    if (req.body.endorse && !student.endorsements.includes(req.user.cruzid)) {
      student.endorsements.push(req.user.cruzid);
    } else if (!req.body.endorse && student.endorsements.includes(req.user.cruzid)) {
      student.endorsements = student.endorsements.filter(value => value !== req.user.cruzid);
    }

    student.save().then(() => {
      res.send("Endorsement successful");
    }).catch(err => {
      console.log(err);
      res.send(err);
    })
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
});

module.exports = router;
