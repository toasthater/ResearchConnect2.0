const express = require('express');
const router = express.Router();
const User = require('../../models/User');



router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findOneAndUpdate({_id:req.user._id}, {$set: {name: req.body.name, bio: req.body.bio, isSetup: true}}, (err, user) =>   {
            if (err) {
                console.log("Something wrong when updating data!");
                res.send(null);
            }
        });
        res.send(user);

    }
    catch {

    }
    
});

module.exports = router;