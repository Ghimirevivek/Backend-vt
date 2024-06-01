const express = require('express');
const passport = require('../passport-setup');
const router = express.Router();

// Initial Google OAuth login
router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000/login',
  })
);

module.exports = router;
