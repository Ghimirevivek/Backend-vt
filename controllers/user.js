const { handleError } = require('../utils/errorhandler');

module.exports.test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};
