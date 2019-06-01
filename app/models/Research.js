const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create schema
const ResearchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'faculty_members',
    required: true,
  },
  cruzid: String,
  created: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
  reqSkills: [String],
  prefSkills: [String],
  summary: String,
  description: String,
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments',
    required: true,
  },
  status: String,
  deadline: {
    type: Date,
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'application',
      required: true,
    },
  ],
  questions: [String],
});

module.exports = Research = mongoose.model('research', ResearchSchema);
