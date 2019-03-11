const express = require('express');
const router = express.Router();

const Research = require('../../models/Research');
const Application = require('../../models/Application');
const Student = require('../../models/Student');
const User = require('../../models/User');
const FacultyMember = require('../../models/FacultyMember');

router.get('/', (req, res) => {
    Application.find().then(research_posts => res.json(research_posts));
});

router.post('/', async (req, res) => {
    try {
        if (req.body.applicant) {
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
        } else {
            Application.findById(req.body.id, async (err, application) => {
                if(err || application === null) {
                    console.log(err);
                    res.send("Error accepting/declining application");
                } else {
                    let research = await Research.findById(application.research);
                    if (!research) {
                        application.remove();
                        res.send("Error accepting/declining application");
                        return;
                    }

                    let professor = await FacultyMember.findById(research.owner);
                    if (professor === null || professor.cruzid !== req.user.cruzid) {
                        res.send("Error accepting/declining application");
                        return;
                    }

                    application.status = req.body.status ? "accepted" : "declined";
                    application.save();
                    res.send("Done");
                }
            })
        }
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', (req, res) => {
    Application.findById(req.params.id)
        .then(application => application.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: true}));
});

module.exports = router;