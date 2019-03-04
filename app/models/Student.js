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
  isProfessor: Boolean,
  isEditing: Boolean
});

module.exports = Student = mongoose.model("students", StudentSchema);
