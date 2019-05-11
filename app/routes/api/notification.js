const express = require("express");
const router = express.Router();
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const keys = require('../../config/keys');
const SGmail = require('@sendgrid/mail')

/* Function for creating a new notification schema and store it in the
 * database. Also push the ID of the notification to the user's database.
 * 
 * It also sends email to the recepient's email address to notify them. */
async function createNewNotification(req, res) {
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

      //SGmail.setApiKey(keys.sendgridAPI);
      //SGmail.send(email)

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
};

//Function for removing the notification from the user's database, but it's
//not removed from the Notification database (archieved?)
async function removeNotification(req, res) {

  User.findOne({ cruzid: req.body.params.cruzid }, (err, user) => {
    if (user.notification === undefined) {
      user.notification = []
    }

    if (user.notification.indexOf(req.body.params.id) > -1) {
      user.notification.splice(user.notification.indexOf(req.body.params.id), 1)

      user.save((err) => {
        if (err) {
          // Handle error
          console.log("error: " + err)
          res.send({ error: err.message });
        } else {
          // send success response
          res.send(user.notification);
        }
      });
    }

    else {
      console.log("Error: Could not find notification in user's data...")
      res.send('Error')
    }
  });
}

router.get('/', (req, res) => {

  const notifications = []

  //Find the user using query cruzID to retrieve it's notification ID's
  User.findOne({ cruzid: req.query.cruzid })
    .then((response) => {

      //Empty response using length, send back an empty response now instead
      if (response.notification.length === 0) {
        res.send([]);
      }

      //Search through all notifications in user's database
      for (let i = 0; i < response.notification.length; i++) {

        //Search each notification by it's ID number from the response above
        Notification.findById(response.notification[i], function (err, notification) {

          //Object body containing the fields we want returned
          const temp = {
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            from: notification.from,
            date: notification.created
          }

          notifications.push(temp)

          //If both length's are equal, then we have finished loading all notifications
          if (notifications.length === response.notification.length) {
            res.send(notifications);
            return;
          }
        })
      }
    });
});

router.post("/", (req, res) => {

  if (req.body.params.type === 'applied') {
    createNewNotification(req, res);
  }
  else if (req.body.params.type === 'clear') {
    removeNotification(req, res);
  }
});

module.exports = router;