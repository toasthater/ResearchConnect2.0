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
  nodeClientID: "709268063172-gaaq6ibr55rf22o5h510mll7tct02fa5.apps.googleusercontent.com",
  nodeClientSecret: "glHceUceAJzts383p-nBRQ9L",
  nodeRefreshKey: "1/iALhRLtEpsQdiokM8-jcyYMuiPnAXIz3c2SC6PCsK_5AE5mJSv3IWqoAV9QK-pC3",
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  baseURL: 'researchconnect.now.sh',
};
