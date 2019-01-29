const express = require('express');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const researchPosts = require('./routes/api/research_posts');
const authRoutes = require('./routes/authRoutes');
require('./models/User');
require('./models/Student');
require('./models/FacultyMember');
require('./models/Department');
require('./models/Research');
require('./models/Application');
require('./services/passport');

const app = express();

app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

// Bodyparser middleware
app.use(bodyParser.json());

// Use routes
app.use('/api/research_posts', researchPosts);

// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected...."))
    .catch(err => console.log(err));


const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));