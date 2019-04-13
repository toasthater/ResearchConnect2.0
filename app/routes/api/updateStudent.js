const express = require("express");
const Student = require("../../models/Student");
const router = express.Router();

router.post("/", (req, res) => {
    if (!req.body.profile_id || !req.body.major) {
      res.send(null);
      return;
    }

    Student.findById(req.body.profile_id, (err, student) => {
      if (err) {
        console.log("Something wrong when updating data!");
        res.send(null);
      } else {
        if (!req.user || req.user.cruzid !== student.cruzid) {
          console.log("Detected invalid profile edit request");
          res.send(null);
        } else {
          student.major = req.body.major;
          student.save();
          res.send(student);
        }
      }
    }).catch(err => {
      console.log(err);
    });
  });
  
  module.exports = router;