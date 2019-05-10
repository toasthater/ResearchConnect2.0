const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

module.exports = {
  mongoURI: process.env.MONGO_URL,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  cookieKey: process.env.COOKIE_KEY,
  sendgridAPI: "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",
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  baseURL: 'researchconnect.now.sh',
};