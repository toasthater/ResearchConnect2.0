const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.post("/", (req, res) => {
    User.findOne({ cruzid: req.body.cruzid }, function (err, user) {
        if (user.followers === undefined)
            user.followers = []

        if (user.followers.includes(req.user.cruzid)) {
            user.followers.splice(user.followers.indexOf(req.user.cruzid))
        }
        else
            user.followers.push(req.user.cruzid);
        var followedUser = user.cruzid;
        user.save(function (err) {
            if (err) {
                //Handle error
                //send error response
                res.status(400).send({ error: err.message });
            }
            else {
                // Secondly, find the user account for the logged in user
                User.findOne({ cruzid: req.user.cruzid }, function (err, user) {
                    if (user.following === undefined)
                        user.following = []
                    if (user.following.includes(followedUser)) {
                        user.following.splice(user.following.indexOf(followedUser))
                    }
                    else
                        user.following.push(followedUser);
                    user.save(function (err) {
                        if (err) {
                            //Handle error
                            //send error response
                            res.status(400).send({ error: err.message });
                        }
                        else {
                            //send success response
                            res.status(200).send("Success");
                        }
                    });
                });
            }
        });
    });
});

module.exports = router;