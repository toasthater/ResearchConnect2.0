const passport = require('passport');
const FacultyMember = require('../models/FacultyMember');


module.exports = app => {
    // Redirect to Google Auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
        hostedDomain: 'ucsc.edu'
    }));

    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/');
        });

    app.get('/api/current_user', async (req, res) => {
        res.send(req.user);
        
        });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/welcome');
    });
};
