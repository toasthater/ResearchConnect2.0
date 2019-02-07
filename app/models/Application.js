const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ApplicationSchema = new Schema({
    research: { 
        type: Schema.Types.ObjectId, ref: 'Research',
        required: true
    },
    student: { 
        type: Schema.Types.ObjectId, ref: 'Student',
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
});

module.exports = Application = mongoose.model('application', ApplicationSchema);