const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/", (req, res) => {
    if (req.query.cruzid !== undefined) {
      User.findOne({
        cruzid: {
          $regex: req.query.cruzid,
          $options: "i"
        }
      })
      .then(user => res.send(user) )
      .catch(err => 
        res.status(404).json(
            { success: true }
            ));
    } else if (req.query.id !== undefined) {
      User.findById(req.query.id)
        .then(user => res.send(user))
        .catch(err => res.status(404).json({ success: true }));
    }
  });

module.exports = router;