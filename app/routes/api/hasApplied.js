const express = require('express');
const router = express.Router();

const Research = require('../../models/Research');
const Application = require('../../models/Application');
const Student = require('../../models/Student');
const User = require('../../models/User');
const FacultyMember = require('../../models/FacultyMember');

// @route GET /api/hasApplied"
// @desc  Bool of whether student has applied or not
// @access Public
router.get('/', (req, res) => {
    if (!req.user || !req.query || !req.query.id) {
        res.send(false);
        return;
    }
    Application.findOne({
        research: req.query.id,
        student: req.user.id
    }).then(data => res.send(data !== null))
    .catch(() => res.send(false));
});

module.exports = router;