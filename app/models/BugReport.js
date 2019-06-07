const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const BugReport = new Schema({
  fromName: String,
  fromCruzID: String,
  status: String,
  message: String,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('bug_report', BugReport);