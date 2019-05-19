const express = require('express');

const router = express.Router();

const User = require('../../models/User');
const Research = require('../../models/Research');

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
            res.send({ status: err })
        }
        else {
            res.send({ status: "success" })
        }
    });

    if (!req.body.isProfessor) {
        Research.find({ cruzid: req.body.cruzid })
            .then(async (research_posts) => {
                var postsToClose = [];

                research_posts.forEach(function (post) {

                    if (post.status === 'Open') {
                        post.status = 'Closed';
                        postsToClose.push(post);
                    }
                })

                await Promise.all(
                    postsToClose.map(function (post) {
                        return Research.findOneAndUpdate(
                            { _id: post._id },
                            { status: post.status }
                        )
                    })
                )
            })
            .catch(err => res.send([new Research()]));
    }
});

module.exports = router;
