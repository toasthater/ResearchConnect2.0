const express = require('express');

const router = express.Router();

const Student = require('../../models/Student');

// router.get("/:cruzid", async (req, res) =>
router.get('/', async (req, res) => {
  console.log(req.query)
  if (req.query.cruzid !== undefined) {
    const relevantStudents = Student.findOne({
      cruzid: {
        $regex: req.query.cruzid,
        $options: 'i',
      },
    });

    await relevantStudents.then(async (student) => {
      res.send(student);
    });
  } else if (req.query.id !== undefined) {
    Student.findById(req.query.id)
      .then(student => res.send(student))
      .catch(err => res.status(404).json({ success: true }));
  }
});

router.post('/', async (req, res) => {

  const userProfile = Student.findOne({
    cruzid: {
      $regex: req.query.cruzid ? req.query.cruzid: req.body.cruzid,
      $options: 'i',
    },
  });

  try {
    await userProfile.then(async (student) => {
      console.log("in the await")
      if (student !== null && student.cruzid !== null) {
        console.log('Updating profile...');

        const updatedProfile = student.updateOne({
          $set: {
            profile_pic: req.body.profile_pic,
            name: req.body.name,
            email: req.body.email,
            major: req.body.major,
            bio: req.body.bio,
            resume: req.body.resume,
          },
        });

        await updatedProfile.then(async (student) => {
          res.send(student);
        });
      } else {
        console.log('Creating new profile...');

        const profile = new Student({
          profile_pic: req.body.profile_pic,
          cruzid: req.body.cruzid,
          name: req.body.name,
          email: req.body.email,
          major: req.body.major,
          bio: req.body.bio,
          resume: req.body.resume,
        });

        profile.save().then(students => res.json(students));
      }
    });
  } catch (err) {
    (err) => {
      console.log(err);
    };
  }
});

module.exports = router;
