const express = require('express');
const router = express.Router();

const Research = require('../../models/Research');
const Application = require('../../models/Application');
const Student = require('../../models/Student');
const User = require('../../models/User');

router.get('/', (req, res) => {
    Application.find().then(research_posts => res.json(research_posts));
});

router.post('/', async (req, res) => {
    let newApplicant = await User.findById(req.body.applicant);
    let newStudent = await User.findOne({
        'cruzid': {
            '$regex': newApplicant.cruzid,
            $options: 'i'
        }
    });

    let research = await Research.findById(req.body.postID);

    for (var i = 0; i < research.applicants.length; i++) {
        let oldApplication = await Application.findById(research.applicants[i]);

        if (newStudent._id.toString() === oldApplication.student.toString()) {
            res.send("You have already applied to this project.");
            return;
        }
    }

    const newApp = new Application({
        research: req.body.postID,
        student: newStudent._id
    });

    await newApp.save();

    research.applicants = [...research.applicants, newApp._id];
    research.save().then(research => res.send("Application successful"));
});

module.exports = router;