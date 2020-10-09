/* eslint-disable prefer-destructuring */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const config = require('../config');
const User = require('../models/userModel');

exports.authCheck = catchAsyncError(async (req, res, next) => {
  // check for token in request
  let token;
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    const { authorization } = req.headers;
    token = authorization.split(' ')[1];
  }

  if (!token) next(new AppError('You are not logged in! Please log in to continue', 401));

  // Verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    config.access_token_secret,
  );

  // check if user stil exist
  const user = await User.findById(decoded.id);
  if (!user) next(new AppError('User no longer exist', 401));

  // Check if user change password after the token was issued
  if (user.hasChangePassword(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  // check if user role is not included in allowed roles
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission to perform this action', 403),
    );
  }
  return next();
};
