const express = require('express');
const { signup, signin, validateUser } = require('../controllers/auth');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/validuser', authenticate, validateUser);
router.get('/logout');
module.exports = router;
