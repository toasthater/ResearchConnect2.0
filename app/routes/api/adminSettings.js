const express = require("express");
const router = express.Router();

const User = require("../../models/User");

const AdminRequest = require("../../models/AdminRequest");
const BugReport = require("../../models/BugReport");

const moment = require('moment');

async function sendAdminRequest(req, res) {
  //Will be utilizing the async library to make calls to call admin users
  var async = require('async');

  //Search through all users for admins, using the isAdmin variable
  let userData = await User.find({ isAdmin: true });

  //Creating a template for the object to be stored, and set appropratiate variables
  const new_adminRequest = new AdminRequest({
    fromName: req.user.name,
    fromCruzID: req.user.cruzid,
    message: req.body.params.message,
    status: 'pending'
  }).save();

  //For each admin user found, make a async call
  async.eachSeries(userData, function (user, next) {

    new_adminRequest.then(response => {
      //If the current admin does not have a field called adminRequests set up yet, create one
      if (user.adminRequests === undefined || user.adminRequests === null) {
        user.adminRequests = []
      }

      //Add the new request, it will hold an array of objects/requests
      user.adminRequests.push(response._id);

      //Save the new data and check for errors
      user.save(function (err) {
        if (err) {
          //console.log("Error: Could not save user data: " + err)
          res.send({ status: err })
        }
      });
    });

    //Itterate to the next user's data
    next();
  }, err => { //Catch any errors that occur while saving the new user data
    if (err)
      res.send({ status: err })
  })

  //The final response, which signifies all other operations were successful as well
  res.send({ status: 'success' });
}

async function sendBugReport(req, res) {
  //Will be utilizing the async library to make calls to call admin users
  var async = require('async');

  //Search through all users for admins, using the isAdmin variable
  let userData = await User.find({ isAdmin: true });

  //Creating a template for the object to be stored, and set appropratiate variables
  const new_bugReport = new BugReport({
    fromName: req.user.name,
    fromCruzID: req.user.cruzid,
    message: req.body.params.message,
    status: 'pending'
  }).save();

  //For each admin user found, make a async call
  async.eachSeries(userData, function (user, next) {
    new_bugReport.then(response => {
      //If the current admin does not have a field called bugReports set up yet, create one
      if (user.bugReports === undefined || user.bugReports === null) {
        user.bugReports = []
      }

      //Add the new request, it will hold an array of objects/requests
      user.bugReports.push(response._id);

      //Save the new data and check for errors
      user.save(function (err) {
        if (err) {
          //console.log("Error: Could not save user data: " + err)
          res.send({ status: err })
        }
      });
    });

    //Itterate to the next user's data
    next();
  }, err => { //Catch any errors that occur while saving the new user data
    if (err)
      res.send({ status: err })
  })

  //The final response, which signifies all other operations were successful as well
  res.send({ status: 'success' });
}

async function getAdminRequests(req, res) {

  const adminRequestList = []

  User.findOne({ cruzid: req.user.cruzid }).then(response => {
    if (response.adminRequests === null || response.adminRequests.length === 0) {
      res.send([]);
      return;
    }

    //Search through all notifications in user's database
    for (let i = 0; i < response.adminRequests.length; i++) {

      //Search each notification by it's ID number from the response above
      AdminRequest.findById(response.adminRequests[i], function (err, request) {

        var newDate = moment(request.created).format('M/DD/YYYY');

        //Object body containing the fields we want returned
        const temp = {
          _id: request._id,
          fromName: request.fromName,
          fromCruzID: request.fromCruzID,
          message: request.message,
          date: newDate
        }

        adminRequestList.push(temp)
        //If both length's are equal, then we have finished loading all notifications
        if (adminRequestList.length === response.adminRequests.length) {

          res.send(adminRequestList);
          return;
        }
      })
    }
  })
}

async function getBugReports(req, res) {

  const bugReportList = []

  User.findOne({ cruzid: req.user.cruzid }).then(response => {
    if (response.bugReports === null || response.bugReports.length === 0) {
      res.send([]);
      return;
    }

    //Search through all notifications in user's database
    for (let i = 0; i < response.bugReports.length; i++) {

      //Search each notification by it's ID number from the response above
      BugReport.findById(response.bugReports[i], function (err, report) {

        var newDate = moment(report.created).format('M/DD/YYYY');

        //Object body containing the fields we want returned
        const temp = {
          _id: report._id,
          fromName: report.fromName,
          fromCruzID: report.fromCruzID,
          message: report.message,
          date: newDate
        }

        bugReportList.push(temp)
        //If both length's are equal, then we have finished loading all notifications
        if (bugReportList.length === response.bugReports.length) {

          res.send(bugReportList);
          return;
        }
      })
    }
  })
}

//GET REQUEST:
router.get("/", (req, res) => {

  if (req.user.isAdmin === false) {
    res.send({ status: 'access denied' });
    return;
  }

  if (req.query.type === 'adminRequest') {
    getAdminRequests(req, res);
  }
  else if (req.query.type === 'bugReport') {
    getBugReports(req, res);
  }
  //res.send('wtf')
});

//The actual router POST function. Front-end will pass the "type" value, which will be either
//adminRequest or reportBug. Each function operates then responses within their function, hence
//the second parameter with each functions below
router.post("/", (req, res) => {

  if (req.body.params.type === 'adminRequest') {
    sendAdminRequest(req, res);
  }
  else if (req.body.params.type === 'bugReport') {
    sendBugReport(req, res);
  }

});

router.delete("/", (req, res) => {

  if (req.body.params.type === 'adminRequest') {
    //sendAdminRequest(req, res);
  }
  else if (req.body.params.type === 'bugReport') {
    //sendBugReport(req, res);
  }

});

module.exports = router;