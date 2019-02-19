const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// router.get('/', async (req, res) => {
//     User.findById(req.query.id)
//     .then(user => res.send({user}))
//     .catch(err => res.status(404).json({success: true}));
// });

// router.post('/setup', async (req, res) => {
//     console.log('--------it gets the right function----------');

// });


router.post('/', (req, res) => {
    console.log(req.body);
    User.findOneAndUpdate({_id:req.user._id}, {$set: {name: req.body.name, bio: req.body.bio, isSetup: true}}, (err, user) =>   {
        if (err) {
            console.log("Something wrong when updating data!");
            res.send(null);
        }

        console.log(user);
        res.send({user})
    });
});

module.exports = router;