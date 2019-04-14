const express = require('express');
const Student = require('../../models/Student');

const router = express.Router();

router.post('/', async (req, res) => {
  Student.findByIdAndUpdate(req.body.profile_id, { $set: { major: req.body.major } },
    (err, user) => {
      if (err) {
        // console.log('Something wrong when updating data!');
        res.send(null);
        var RES_SENT = true;
      } else {
        const EDITED_STUDENT = user;
        res.send(EDITED_STUDENT);
        var RES_SENT = true;
      }
    })
    .catch((err) => {
      // console.log(err);
    });
});

module.exports = router;
