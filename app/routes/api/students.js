const express = require("express");
const router = express.Router();

const Student = require("../../models/Student");

//router.get("/:cruzid", async (req, res) =>
router.get("/", async (req, res) => {
  if (req.query.cruzid !== undefined)
  {
      let relevantStudents = Student.find({
              'cruzid': {
                  '$regex': req.query.cruzid,
                  $options: 'i'
              }
          });
      await relevantStudents.then(async (student) => {
          res.send(student);
      });
  }
  else if (req.query.id !== undefined)
  {
      Student.findById(req.query.id)
      .then(student => res.send(student))
      .catch(err => res.status(404).json({success: true}));
  }
});

router.post("/", async (req, res) => {
  const profile = new Student({
    cruzid: req.body.cruzid,
    name: req.body.name,
    email: req.body.email,
    major: req.body.major,
    bio: req.body.bio,
    resume: req.body.resume
  });

  profile.save().then(students => res.json(students));
});

router.delete("/", (req, res) => {
  Student.deleteOne({ cruzid: req.query.cruzid })
    .then(students => res.send(students))
    .catch(console.log);
});

module.exports = router;
