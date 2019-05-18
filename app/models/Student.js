const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create schema
const StudentSchema = new Schema({
  cruzid: {
    type: String,
    required: true,
  },
  major: String,
  resume: String,
  endorsements: [String],
});

module.exports = Student = mongoose.model('students', StudentSchema);
