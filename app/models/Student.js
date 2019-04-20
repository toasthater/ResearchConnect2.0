const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const StudentSchema = new Schema({
  cruzid: {
    type: String,
    required: true
  },
  major: String,
  resume: String,
  research: [Schema.Types.ObjectId]
});

module.exports = Student = mongoose.model("students", StudentSchema);
