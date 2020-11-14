const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  const user = new User({
    email,
    password,
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, async (err, hash) => {
      user.password = hash;
      try {
        const newUser = await user.save();
        res.status(201).json({
          success: true,
          data: newUser,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: 'Server Error',
        });
      }
    });
  });
});

router.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await auth.authenticate(email, password);

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: '6h',
    });

    const { iat, exp } = jwt.decode(token);

    res.status(200).json({
      iat,
      exp,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      error: err,
    });
  }
});

module.exports = router;
