const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const keys = require('../../config/keys');

var nodemailer = require('nodemailer');

async function send_notification(recipient) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      type: 'OAuth2',
      clientId: keys.nodeClientID,
      clientSecret: keys.nodeClientSecret
    },
    tls: { rejectUnauthorized: false }
  });

  let notify = await transporter.sendMail({
    from: 'ResearchConnect <email-notification@researchconnect.iam.gserviceaccount.com>',
    to: recipient,
    subject: 'New Applicant Notification',
    text: 'A student has applied to your research!',
    auth: {
      user: 'gkchoi@ucsc.edu',
      refreshToken: keys.nodeRefreshKey,
      expires: 1484314697598
    }
  }, (err, res) => {
    if (err) {
      console.log("Error")
      //res.send(err)
    }
    else {
      console.log(res.response)
      //res.send(res);
    }
  })

  notify.then(res => { return res })
}

router.post('/', (req, res) => {

  //Search for recipient's email address then send the email
  let user = User.findOne({
    cruzid: {
      $regex: req.user.cruzid,
      $options: "i"
    }
  }).then(res => send_notification("gchoi363@gmail.com" /*res.email*/))
    .then(res => res.send(res))
    .catch(err => res.status(404).json({ success: true }));
})

module.exports = router;