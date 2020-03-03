const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create schema
const ActiveFacultySchema = new Schema({
  cruzid: {
    type: String,
    required: true,
  },
  name: String,
  email: String,
  page: String,
  interest: String,
  pic: String,
  title: String,
  pub: [String],
}); 



module.exports = ActiveFaculty = mongoose.model('active_faculty', ActiveFacultySchema);
