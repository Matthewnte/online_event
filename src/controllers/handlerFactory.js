const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) => catchAsyncError(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateOne = (Model) => catchAsyncError(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.createOne = (Model) => catchAsyncError(async (req, res) => {
  const doc = await Model.create(req.body);
  return res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getOne = (Model, populateOptions) => catchAsyncError(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (populateOptions) query = query.populate(populateOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
