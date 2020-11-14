const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    trim: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
