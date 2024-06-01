const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('googledb', userSchema);
