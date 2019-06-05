const express = require("express");
const router = express.Router();
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const keys = require('../../config/keys');
const SGmail = require('@sendgrid/mail');
const Researches = require("../../models/Research");

const moment = require('moment')

/* Function for creating a new notification schema and store it in the
 * database. Also push the ID of the notification to the user's database.
 * 
 * It also sends email to the recepient's email address to notify them. */
async function createNewNotification(req, res) {
  var subject, message, templateID, to, toName, from, fromName, fromEmail

  var emailTo

  let researchPost = await Researches.findById(req.body.params.postID);
  let recipientUser = await User.findOne({ cruzid: req.body.params.cruzid });
  let researchOwner = await User.findOne({ cruzid: researchPost.cruzid });

  if (req.body.params.type === 'applied') {
    to = recipientUser.email
    toName = recipientUser.name
    from = 'ResearchConnect <notify@researchconnect.me>'
    fromName = 'ResearchConnect'
    fromEmail = 'notify@researchconnect.me'
    subject = 'New Applicant'
    message = 'A student has applied to your ' + researchPost.title + ' post.'
    templateID = 'd-d368a58506994f63a4b4e29f138f9569'
    applicant = req.user

    emailTo = [{
      email: recipientUser.email,
      name: recipientUser.name
    }]
  }
  else if (req.body.params.type === 'accepted') {
    to = recipientUser.email
    toName = recipientUser.name
    from = 'ResearchConnect <notify@researchconnect.me>'
    fromName = 'ResearchConnect'
    fromEmail = 'notify@researchconnect.me'
    subject = "Application Accepted"
    message = "Your application for " + researchPost.title + " has been accepted."
    templateID = 'd-8fdceda611e74b0b83bb33438d34eba3'

    emailTo = [{
      email: recipientUser.email,
      name: recipientUser.name
    }]
  }
  else if (req.body.params.type === 'declined') {
    to = recipientUser.email
    toName = recipientUser.name
    from = 'ResearchConnect <notify@researchconnect.me>'
    fromName = 'ResearchConnect'
    fromEmail = 'notify@researchconnect.me'
    subject = "Application Declined"
    message = "Your application for " + researchPost.title + " has been declined."
    templateID = 'd-3a640d1cef3a467b804b0710d786cc92'

    emailTo = [{
      email: recipientUser.email,
      name: recipientUser.name
    }]
  }

  //This one send an email to the student to initiate the interview process
  else if (req.body.params.type === 'interview') {
    to = [recipientUser.email, researchOwner.email]
    toName = [recipientUser.name, researchOwner.name]
    from = researchOwner.email
    fromName = researchOwner.name
    fromEmail = researchOwner.email
    subject = "Schedule an interview with " + recipientUser.name
    message = "Please schedule an interview for the research post " + researchPost.title + "."
    templateID = 'd-7f803775393441cfb35db4782a0446c0'

    emailTo = [{
      email: recipientUser.email,
      name: recipientUser.name
    },
    {
      email: researchOwner.email,
      name: researchOwner.name
    }]
  }
  else {
    console.log("invalid query type...")
  }

  const new_notification = new Notification({
    type: req.body.params.type,
    cruzid: req.body.params.cruzid,
    to: to,
    from: from,
    subject: subject,
    message: message,
    title: researchPost.title,
    recipientName: req.user.name,
    recipientResume: req.user.resume ? req.user.resume : "None"
  }).save();

  new_notification.then(response => {

    if (recipientUser.notification === undefined || recipientUser.notification === null)
      recipientUser.notification = []

    recipientUser.notification.push(response._id)

    const email = {
      personalizations: [
        {
          to: emailTo,

          dynamic_template_data: {
            recipient_name: toName,
            research_owner: researchOwner.name,
            research_title: researchPost.title,

            //Used in the "Accepted" sendGrid email template
            applicant_name: req.user.name,
            applicant_email: req.user.email,
            applicant_resume: req.user.resume ? req.user.resume : "No resume available",

          }
        }
      ],
      from: {
        email: 'notify@researchconnect.me',
        name: 'ResearchConnect'
      },
      reply_to: {
        email: fromEmail,
        name: fromName
      },
      template_id: templateID
    }

    SGmail.setApiKey(keys.sendgridAPI);
    SGmail.send(email);

    //If it was applied, send a confirmation email to the student
    if (req.body.params.type === 'applied') {
      let tempEmailTo = [{
        email: req.user.email,
        name: req.user.name
      }]

      email.personalizations[0].to = tempEmailTo
      email.personalizations[0].dynamic_template_data.recipient_name = req.user.name

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