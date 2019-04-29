const cloudinary = require('cloudinary');
cloudinary.config(require('./config/keys').cloudinary);

module.exports = cloudinary;
