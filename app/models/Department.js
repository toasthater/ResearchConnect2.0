const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create schema
const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: Number,
});

module.exports = Department = mongoose.model('departments', DepartmentSchema);
