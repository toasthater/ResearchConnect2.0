const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create schema
const FacultyMemberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cruzid: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  department: {
    type: String,
    required: false
  },
  isProfessor: Boolean
});

module.exports = FacultyMember = mongoose.model(
  "faculty_members",
  FacultyMemberSchema
);
