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
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Research = mongoose.model('notification', Notification);