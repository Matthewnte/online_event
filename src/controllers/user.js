const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();

  return res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError('No user found', 404));

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsyncError(async (req, res, next) => {
  // create Error if user post password data
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("You can't update password here", 400));
  }

  // update user documnet
  const allowedFields = ['firstName', 'lastName', 'email'];
  const filteredBody = filterObj(req.body, allowedFields);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsyncError(async (req, res) => {
  await User.findOneAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

// DO NOT update password here
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
