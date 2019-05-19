const express = require('express');

const router = express.Router();

const User = require('../../models/User');

router.post("/", (req, res) => {
    if (!req.body.isAdmin) {
        res.send(null);
        return;
    }
    User.updateOne(
        { cruzid: req.body.cruzid },
        {
            isProfessor: req.body.isProfessor
        },
    ).then(function (err) {
        if (err) {
            res.send({ status: err})
        }
        else {
            res.send({ status: "success"})
        }
    });
});

module.exports = router;
