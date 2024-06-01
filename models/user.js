const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('not valid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// token generate
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token23 = jwt.sign({ _id: this._id }, 'secret', {
      expiresIn: '1d',
    });

    this.tokens = this.tokens.concat({ token: token23 });
    await this.save();
    return token23;
  } catch (error) {
    res.status(422).json(error);
  }
};
module.exports = mongoose.model('User', userSchema);
