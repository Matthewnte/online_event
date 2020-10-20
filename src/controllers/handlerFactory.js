const escapeStringRegexp = require('escape-string-regexp');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

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

exports.findMatch = (Model) => catchAsyncError(async (req, res, next) => {
  let query = {};

  // Make a copy of req.query
  const reqQuery = { ...req.query };

  // Query params to be excluded as fields to match in DB for filtering
  const removedParams = ['sort', 'page', 'limit'];

  // remove excluded query params from query string
  removedParams.forEach((param) => delete reqQuery[param]);

  // Query term
  const { term } = reqQuery;

  if (!term) {
    return next(new AppError('Please provide a search term', 400));
  }

  // Escape RegExp special characters.
  const $regex = escapeStringRegexp(term);

  query = Model.find({
    $and: [
      {
        $or: [
          { name: { $regex, $options: 'i' } },
          // { price: { $regex, $options: 'i' } },
          { platform: { $regex, $options: 'i' } },
          { category: { $regex, $options: 'i' } },
          { tags: { $regex, $options: 'i' } },
        ],
      },
    ],
  });
  const doc = await query;

  if (!doc) {
    return next(new AppError(`No document found for ${req.params.event}`, 404));
  }

  return res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.getAll = (Model) => catchAsyncError(async (req, res) => {
  // let filter = {};
  // if (query.params.eventId) filter = { event: req.params.eventId };
  // Execute query
  const features = new ApiFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // Send response
  return res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.getUserEvents = (Model) => catchAsyncError(async (req, res) => {
  const filter = {};
  // if (query.params.eventId) filter = { event: req.params.eventId };
  // Execute query
  if (req.user) filter.category = req.user.categories;

  const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // Send response
  return res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});
