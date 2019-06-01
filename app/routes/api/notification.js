const express = require("express");
const router = express.Router();
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const keys = require('../../config/keys');
const SGmail = require('@sendgrid/mail');
const Researches = require("../../models/Research");

const moment = require('moment');
/* Function for creating a new notification schema and store it in the
 * database. Also push the ID of the notification to the user's database.
 * 
 * It also sends email to the recepient's email address to notify them. */
async function createNewNotification(req, res) {
  var subject, message, templateID, applicant

  let researchPost = await Researches.findById(req.body.params.postID);
  let recipientUser = await User.findOne({ cruzid: req.body.params.cruzid });
  let researchOwner = await User.findOne({ cruzid: researchPost.cruzid });

  if (req.body.params.type === 'applied') {
    subject = "New Applicant"
    message = "A student has applied to your " + researchPost.title + " post."
    templateID = 'd-d368a58506994f63a4b4e29f138f9569'
    applicant = req.user
    //scheduleTime = 0
  }
  else if (req.body.params.type === 'accepted') {
    subject = "Application Accepted"
    message = "Your application for " + researchPost.title + " has been accepted."
    templateID = 'd-8fdceda611e74b0b83bb33438d34eba3'
    //scheduleTime = 0
  }
  else if (req.body.params.type === 'declined') {
    subject = "Application Declined"
    message = "Your application for " + researchPost.title + " has been declined."
    templateID = 'd-3a640d1cef3a467b804b0710d786cc92'
    //scheduleTime = 0
  }
  else if (req.body.params.type === 'interview') {
    subject = "Interview Scheduled"
    message = "Interview has been scheduled for the research project " + researchPost.title + "."
    templateID = 'd-7f803775393441cfb35db4782a0446c0'
    //scheduleTime = "24:00"
  }
  else {
    console.log("invalid query type...")
  }

  const new_notification = new Notification({
    type: req.body.params.type,
    cruzid: req.body.params.cruzid,
    to: recipientUser.email,
    from: "ResearchConnect <admin@researchconnect.net>",
    subject: subject,
    message: message,
    title: researchPost.title,
    recipientName: recipientUser.name,
    recipientResume: recipientUser.resume ? recipientUser.resume : "No resume available"
    //scheduleTime = 0
  }).save();

  new_notification.then(response => {

    if (recipientUser.notification === undefined || recipientUser.notification === null)
      recipientUser.notification = []

    recipientUser.notification.push(response._id)

    const email = {
      personalizations: [
        {
          to: [
            {
              email: recipientUser.email,
              name: recipientUser.name
            }
          ],

          dynamic_template_data: {
            recipient_name: recipientUser.name,
            research_owner: researchOwner.name,
            research_title: researchPost.title,

            //Used in the "Accepted" sendGrid email template
            applicant_name: req.user.name,
            applicant_email: req.user.email,
            applicant_resume: req.user.resume ? req.user.resume : "No resume available",

            //Used in the "Interview" sendGrid email template
            schedule_time: "24:00:01"
          }
        }
      ],
      from: {
        email: "admin@researchconnect.net",
        name: "ResearchConnect"
      },
      reply_to: {
        email: "admin@researchconnect.net",
        name: "ResearchConnect"
      },
      template_id: templateID
    }

    SGmail.setApiKey(keys.sendgridAPI);
    SGmail.send(email);

    //Applying to application sends an email to the applicant as well
    if (req.body.params.type === 'applied') {

      email.personalizations[0].to[0].email = req.user.email
      email.personalizations[0].to[0].name = req.user.name
      email.template_id = "d-7baf5179e5884663b7840101b30aed2f"

      SGmail.send(email);
    }

    recipientUser.save(function (err) {
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

          var newDate = moment(notification.created).format('M/DD/YYYY');

          //Object body containing the fields we want returned
          const temp = {
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            from: notification.from,
            date: newDate,

            subject: notification.subject,
            title: notification.title,
            applicantName: notification.recipientName,
            applicantResume: notification.recipientResume
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

  if (req.body.params.type === 'clear') {
    removeNotification(req, res);
  }
  else {
    createNewNotification(req, res);
  }
});

module.exports = router;