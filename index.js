const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const googleRoutes = require('./routes/googleRoutes.js');
const authRoutes = require('./routes/auth.js');
const passport = require('./passport-setup.js');
const session = require('express-session');
const cookiParser = require('cookie-parser');
const cors = require('cors');
const app = express();
dotenv.config();

//3rd party middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(cookiParser());

//Db connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log('DB Error', err));

// setup session
app.use(
  session({
    secret: 'YOUR SECRET KEY',
    resave: false,
    saveUninitialized: true,
  })
);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

// app.use('/api', userRoutes);
app.use('/auth', authRoutes);
app.use('/auth/google', googleRoutes);

app.get('/login/sucess', async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: 'user Login', user: req.user });
  } else {
    res.status(400).json({ message: 'Not Authorized' });
  }
});

app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('http://localhost:3000/login');
  });
});
//404 route
app.all('*', (req, res) => {
  res.send('<h1>Page Not Found!</h1>');
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.log('error handling middleware', err);
  res.send(err);
});

app.listen(4000, () => console.log('Server is running on port 4000'));
