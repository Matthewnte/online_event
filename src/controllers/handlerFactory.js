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
    return next(new AppError('No doc found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
