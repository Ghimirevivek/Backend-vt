const User = require('../models/user.js');
const { handleError } = require('../middlewares/errorhandler.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.signup = handleError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: 'User Aready exists' });
  }
  if (!email || !password) {
    res.status(422).json({ error: 'fill all the details' });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  const storeData = await newUser.save();
  res.status(201).json({ message: 'User created successfully', storeData });
});

module.exports.signin = handleError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'Email not registered' });
  }
  if (!email || !password) {
    res.status(422).json({ error: 'fill all the details' });
  }
  const passwordMatch = await bcryptjs.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.json({ message: 'Invalid password' });
  }
  const { password: hashedPassword, ...rest } = user._doc;

  // token generate
  const token = await user.generateAuthtoken();

  res.cookie('access-token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 3600000), //1 hour
  });
  return res.status(200).json(rest);
});

module.exports.validateUser = handleError(async (req, res) => {
  const ValidUserOne = await User.findOne({ _id: req.userId });
  res.status(201).json({ status: 201, ValidUserOne });
});
module.exports.logout = handleError(async (req, res) => {
  req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
    return curelem.token !== req.token;
  });

  res.clearCookie('usercookie', { path: '/' });

  req.rootUser.save();

  res.status(201).json({ status: 201 });
});
