const express = require('express');
const router = express.Router();

const Research = require('../../models/Research');
const Application = require('../../models/Application');
const User = require('../../models/User');
const FacultyMember = require('../../models/FacultyMember');

router.get('/', (req, res) => {
    Application.find().then(applications => res.json(applications));
});

router.post('/', async (req, res) => {
    if (!req.user || !req.query) {
        res.send(null);
        return;
    }

    try {
        if (req.body.applicant) {
            if (req.body.applicant.toString() !== req.user._id.toString() || !req.body.postID) {
                res.send('Error applying to project');
                return;
            }

            let newStudent = await User.findOne({
                'cruzid': {
                    '$regex': req.user.cruzid,
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
            if (!req.body.id || req.body.status !== 'pending') {
                res.send("Error accepting/declining application");
                return;
            }

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