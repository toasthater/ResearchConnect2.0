const express = require("express");
const Student = require("../../models/Student");
const router = express.Router();

router.post("/", async (req, res) => {
    Student.findByIdAndUpdate(req.body.profile_id,{ $set: { major: req.body.major } },
        (err, user) => {
          if (err) {
            console.log("Something wrong when updating data!");
            res.send(null);
            res_sent = true;
          } else {
            edited_student = user;
            res.send(edited_student);
            res_sent = true;
          }
        })
    .catch(err => {
      console.log(err);
    });
  });
  
  module.exports = router;