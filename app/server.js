const express = require('express');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const researchPosts = require('./routes/api/research_posts');
const department = require('./routes/api/department');
const facultyMember = require('./routes/api/faculty_members');
const search = require('./routes/api/search');
const authRoutes = require('./routes/authRoutes');
const setup = require('./routes/api/setup');
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
app.use('/api/search', search);
app.use('/api/research_posts', researchPosts);
app.use('/api/department', department);
app.use('/api/faculty_members', facultyMember);
app.use('/api/setup', setup);


// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected...."))
    .catch(err => console.log(err));


const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));