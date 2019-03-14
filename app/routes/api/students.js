const express = require("express");
const router = express.Router();

const Student = require("../../models/Student");

//router.get("/:cruzid", async (req, res) =>
router.get("/", async (req, res) => {
  if (req.query.cruzid !== undefined) {
    let relevantStudents = Student.findOne({
      cruzid: {
        $regex: req.query.cruzid,
        $options: "i"
      }
    });

    await relevantStudents.then(async student => {
      res.send(student);
    });
  } else if (req.query.id !== undefined) {
    Student.findById(req.query.id)
      .then(student => res.send(student))
      .catch(err => res.status(404).json({ success: true }));
  }
});

router.post("/", async (req, res) => {
  //if (req.query.cruzid === undefined) {
  //console.log("UPDATE API TRIGGERED");

  let userProfile = Student.findOne({
    cruzid: {
      $regex: req.query.cruzid,
      $options: "i"
    }
  });

  //if (userProfile === null || userProfile === undefined) {
  //console.log("User does not exist. Creating...");
  try {
    await userProfile.then(async student => {
      if (student !== null && student.cruzid !== null) {
        console.log("Updating profile...");

        let updatedProfile = student.updateOne({
          $set: {
            profile_pic: req.body.profile_pic,
            //cruzid: req.body.cruzid,
            name: req.body.name,
            email: req.body.email,
            major: req.body.major,
            bio: req.body.bio,
            resume: req.body.resume
          }
        });

        await updatedProfile.then(async student => {
          res.send(student);
          //userProfile.save().then(students => res.json(students));
        });
      } else {
        console.log("Creating new profile...");

        const profile = new Student({
          profile_pic: req.body.profile_pic,
          cruzid: req.body.cruzid,
          name: req.body.name,
          email: req.body.email,
          major: req.body.major,
          bio: req.body.bio,
          resume: req.body.resume
        });

        profile.save().then(students => res.json(students));
      }
    });
  } catch (err) {
    err => {
      console.log(err);
    };
  }
  /*} else {
    console.log("User does exist. Updating...");
  }*/

  //console.log("Query: " + req.query.cruzid);
  //console.log("Body: " + req.body.cruzid);

  /*if (req.query.cruzid === req.body.cruzid) {
    console.log("User already exists, updating...");
  } else {
    await userProfile.then(async student => {
      const profile = new Student({
        profile_pic: req.body.profile_pic,
        cruzid: req.body.cruzid,
        name: req.body.name,
        email: req.body.email,
        major: req.body.major,
        bio: req.body.bio,
        resume: req.body.resume,
        isProfessor: false
      });

      profile.save().then(students => res.json(students));
    });
  }*/

  /*} else {
    const profile = new Student({
      profile_pic: req.body.profile_pic,
      cruzid: req.body.cruzid,
      name: req.body.name,
      email: req.body.email,
      major: req.body.major,
      bio: req.body.bio,
      resume: req.body.resume,
      isProfessor: false
    });

    profile.save().then(students => res.json(students));
  }*/
});

router.delete("/", (req, res) => {
  Student.deleteOne({ cruzid: req.query.cruzid })
    .then(students => res.send(students))
    .catch(console.log);
});

module.exports = router;
