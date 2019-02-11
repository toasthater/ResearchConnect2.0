const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    googleId: String,
    isProfessor: Boolean,
    isSetup: Boolean,
    email: String,
    name: String,
    cruzid: String,
    profile_pic: String
})

module.exports = User = mongoose.model('users', UserSchema);