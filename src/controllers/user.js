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

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

// DO NOT update password here
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
