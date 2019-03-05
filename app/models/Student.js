const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const StudentSchema = new Schema({
  cruzid: {
    type: String,
    required: true
  },
  name: String,
  email: String,
  major: String,
  bio: String,
  resume: String,
  following: [String],
  followers: [String]
});

module.exports = Student = mongoose.model("students", StudentSchema);
