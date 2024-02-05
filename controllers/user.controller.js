const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/index');
var parser = require('ua-parser-js');

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all the required fields');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be up to 6 characters');
  }

  // Check if the user exists in our database
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  // Get UserAgent
  const ua = parser(req.headers['user-agent']);
  const UserAgent = [ua.ua];

  // Create new User
  const user = await User.create({
    name,
    email,
    password,
    UserAgent,
  });

  // Log in user after creating account
  // Generate Token
  const token = generateToken(user.id);

  // Send HTTP-only cookie
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: 'none',
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone, bio, photo, role, isVerified } = user;

    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
      UserAgent,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// LoginUser
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please fill in your email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found, please signup');
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  //   Trigger 2FA for Unknown UserAgent


  // Generate Token
  const token = generateToken(user.id);

  if (user && passwordIsCorrect) {
    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    const { _id, name, email, phone, bio, photo, role, isVerified } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  } else {
    res.status(500);
    throw new Error('Something went wrong, please try again');
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
     // Send HTTP-only cookie
     res.cookie('token', "", {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true,
      });

      return res.status(200).json({ message: "Logout successful" });
})

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
