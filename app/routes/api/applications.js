const express = require('express');
const router = express.Router();

const Research = require('../../models/Research');

router.post('/', (req, res) => {
    console.log(req.body.postID);
    
    Research.findById(req.body.postID)
    .then(data => {
        if (data.applicants.includes(req.body.applicant)) {
            res.send("You have already applied to this project.");
        } else {
            data.applicants = [...data.applicants, req.body.applicant];
            data.save().then(research => res.send("Application successful"));
        }
    });
});

module.exports = router;