const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ResearchSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'faculty_members',
        required: true
    }, 
    created: {
        type: Date,
        default: Date.now
    },
    tags: [String],
    description: String,
    department: { 
        type: Schema.Types.ObjectId, 
        ref: 'departments',
        required: true
    },
    status: String,
    deadline: {
        type: Date,
        required: true
    },
    applicants: {
        type: [Schema.Types.ObjectId],
        require: true,
        default: []
    }
});

module.exports = Research = mongoose.model('research', ResearchSchema);