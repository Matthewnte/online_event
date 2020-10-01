const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const config = require('../config');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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

  // Send resetToken to user email
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Hello ${user.firstName}, \nsomeone just requested to change your password. You can do this through the link below.\n${resetUrl}\nIf you didn't request this, please ignore this email. Your password will stay safe and won't be changed.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset password instructions',
      message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending this mail, Try again later'),
      500,
    );
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);

  // Verify token and user, then set new password
  if (!user) return next(new AppError('Token is invalid or has expired'), 400);
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Update changePasswordAt property of the user

  // Log the user in, send jwt
  const accessToken = signAccessToken(user._id);
  const refreshToken = signAccessToken(user._id);

  return res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken,
  });
});
