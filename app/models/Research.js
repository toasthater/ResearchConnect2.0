const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ResearchSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: { type: Schema.Types.ObjectId, ref: 'faculty_members' }, 
    created: {
        type: Date,
        default: Date.now
    },
    tags: [String],
    description: String,
    department: { type: Schema.Types.ObjectId, ref: 'departments' },
    status: String,
    deadline: Date
});

module.exports = Research = mongoose.model('research', ResearchSchema);