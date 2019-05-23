const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const Notification = new Schema({
  type: String,
  cruzid: String,
  to: String,
  from: String,
  subject: String,
  message: String,
  title: String,
  interviewTime: Date,
  recipientName: String,
  recipientResume: String,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Research = mongoose.model('notification', Notification);