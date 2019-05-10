const path = require('path');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const keys = require('./config/keys');
const researchPosts = require('./routes/api/research_posts');
const department = require('./routes/api/department');
const facultyMember = require('./routes/api/faculty_members');
const search = require('./routes/api/search');
const authRoutes = require('./routes/authRoutes');
const setup = require('./routes/api/setup');
const updateStudent = require('./routes/api/updateStudent');
const users = require('./routes/api/users');
const follow = require('./routes/api/follow');
const studentMember = require("./routes/api/students");
const resume = require("./routes/api/resume");
const hasApplied = require("./routes/api/hasApplied");
const notification = require("./routes/api/notification")

require('./models/User');
require('./models/Student');
require('./models/FacultyMember');
require('./models/Department');
require('./models/Research');
require('./models/Application');
require('./services/passport');

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

app.use(busboy());

// Bodyparser middleware
app.use(bodyParser.json());

// Use routes
app.use('/api/search', search);
app.use('/api/users', users);
app.use('/api/follow', follow);
app.use('/api/research_posts', researchPosts);
app.use('/api/department', department);
app.use('/api/faculty_members', facultyMember);
// app.use("/api/user", users);
app.use('/api/students', studentMember);
app.use('/api/setup', setup);
app.use('/api/updateStudent', updateStudent);
app.use("/api/resume", resume);
app.use("/api/apply", require("./routes/api/applications"));
app.use("/api/hasApplied", hasApplied);
app.use("/api/notification", notification);

// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db, {
    poolSize: 3,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 100,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected...."))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
