const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const config = require('../config');
const AppError = require('../utils/appError');

const signAccessToken = (id) => jwt.sign({ id }, config.access_token_secret, {
  expiresIn: config.access_secret_expiresIn,
});

const signRefreshToken = (id) => jwt.sign({ id }, config.refresh_token_secret, {
  expiresIn: config.refresh_secret_expiresIn,
});

const verifyRefreshToken = (refreshToken) => new Promise((resolve, reject) => {
  jwt.verify(refreshToken, config.refresh_token_secret, (err, payload) => {
    if (err) return reject(new AppError('could not verify token', 401));
    return resolve(payload.id);
  });
});

exports.signup = catchAsyncError(async (req, res) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const accessToken = signAccessToken(newUser._id);

  res.status(201).json({
    status: 'success',
    accessToken,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password is empty
  if (!email && !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  return res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: {
      user,
    },
  });
});

exports.refreshToken = catchAsyncError(async (req, res, next) => {
  // get refresh token from req
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError('refreshToken not found', 400));

  // verify refresh token
  const userId = await verifyRefreshToken(refreshToken);

  // sign new jwt accessToken and refresh token
  const newRefreshToken = signRefreshToken(userId);
  const newAccessToken = signAccessToken(userId);

  // return response
  return res.status(200).json({
    status: 'success',
    data: {
      newAccessToken,
      newRefreshToken,
    },
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new AppError('There is no user with that email address'));

  // Generete random reset token
  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new AppError('There is no user with that email address'));

  // Generete random reset token
  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });
});
