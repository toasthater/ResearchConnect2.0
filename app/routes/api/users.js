const express = require('express');
const router = express.Router();
const User = require('../../models/User');


router.post('/setup', async (req, res) => {
    console.log('--------it gets the right function----------');
    User.findOneAndUpdate({_id:req.params.id}, req.body, function (err, place) {
        res.send(req.user);
      });
});


module.exports = router;