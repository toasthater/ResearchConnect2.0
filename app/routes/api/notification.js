const express = require("express");
const router = express.Router();
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const keys = require('../../config/keys');
const SGmail = require('@sendgrid/mail')


async function fetchNotification(req, res) {
  const notifications = []

  User.findOne({ cruzid: req.query.cruzid })
    .then((response) => {

      for (let i = 0; i < response.notification.length; i++) {

        Notification.findById(response.notification[i], function (err, notification) {

          /*const temp = {
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            from: notification.from
          }*/

          notifications.push(notification._id)

          if (i === response.notification.length - 1) {

            res.send(notifications)
          }
        })
      }
    })
}


router.get('/', (req, res) => {

  fetchNotification(req, res)

})


router.post("/", (req, res) => {
  var subject, message

  if (req.body.params.type === 'welcome') {
    subject = "Welcome!",
      message = "Welcome to Research Connect!"
  }
  else if (req.body.params.type === 'applied') {
    subject = "New Student Applicant",
      message = "A student has applied to your research!"
  }
  else if (req.body.params.type === 'accepted') {
    subject = "Accepted: Research Project",
      message = "You have been accepted to the research project!"
  }
  else if (req.body.params.type === 'declined') {
    subject = "Declined: Research Project",
      message = "You have been declined to the research project!"
  }
  else {
    console.log("invalid query type...")
  }

  const new_notification = new Notification({
    type: req.body.params.type,
    cruzid: req.body.params.cruzid,
    to: req.body.params.cruzid + "@ucsc.edu",
    from: "ResearchConnect <admin@researchconnect.net>",
    subject: subject,
    message: message,
  }).save();

  new_notification.then(response => {

    User.findOne({ cruzid: req.body.params.cruzid }, function (err, user) {

      if (user.notification === undefined || user.notification === null)
        user.notification = []

      user.notification.push(response._id)

      const email = {
        to: response.to,
        from: response.from,
        subject: response.subject,
        text: response.message
      }

      SGmail.setApiKey(keys.sendgridAPI);
      SGmail.send(email)

      user.save(function (err) {
        if (err) {
          //console.log("Error: Could not save user data: " + err)
          res.send({ status: err })
        }
        else {
          //console.log("Successfully updated the user data")
          res.send({ status: "success" })
        }
      });
    })
  })
});

router.delete('/', (req, res) => {

})

module.exports = router;