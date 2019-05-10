const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  googleId: String,
  isProfessor: Boolean,
  isSetup: Boolean,
  email: String,
  name: String,
  cruzid: String,
  bio: String,
  profile_pic: String,
  resume: String,
  following: [String],
  followers: [String],
  //notification: [{ _id: String, type: String, from: String, message: String }]
  notification: [{ type: Schema.Types.ObjectId, ref: 'notification' }]
});

module.exports = User = mongoose.model('users', UserSchema);
