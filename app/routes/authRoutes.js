const passport = require('passport');
const querystring = require('querystring');
const { URL } = require('url');
const os = require('os');
const keys = require('../config/keys');


module.exports = (app) => {
  // Redirect to Google Auth
  app.get('/auth/google', (req, res, next) => {
    const state = req.header('host') || '';
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      hostedDomain: 'ucsc.edu',
      state,
    })(req, res, next);
  });

  app.get(
    '/auth/google/callback',
    (req, res, next) => {
      const { state } = req.query;
      if (state && state !== keys.baseURL) {
        const query = { ...req.query };
        delete query.state;
        const baseURL = new URL(req.path, `http://${state}`);
        const redirectURL = `${baseURL.toString()}?${querystring.stringify(query)}`;
        return res.redirect(redirectURL);
      }
      next();
    },
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    },
  );

  app.get('/api/current_user', async (req, res) => {
    res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
