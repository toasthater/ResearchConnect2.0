const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cruzid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    major: String,
    resume: String
});

module.exports = Student = mongoose.model('student', StudentSchema);
