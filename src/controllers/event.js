const Event = require('../models/eventModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

exports.createEvent = catchAsyncError(async (req, res) => {
  const reqBody = { ...req.body, category: req.body.category.toLowerCase() };
  const newEvent = await Event.create(reqBody);
  return res.status(201).json({
    status: 'success',
    data: {
      event: newEvent,
    },
  });
});

exports.getAllEvents = catchAsyncError(async (req, res) => {
  // Execute query
  const features = new ApiFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const events = await features.query;

  // Send response
  return res.status(200).json({
    status: 'success',
    results: events.length,
    data: {
      events,
    },
  });
});

exports.getEvent = catchAsyncError(async (req, res, next) => {
  const event = await (await Event.findById(req.params.id));

  if (!event) {
    return next(new AppError('No event found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

exports.updateEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    return next(new AppError('No event found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

exports.deleteEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('No event found', 404));
  }

  return res.status(204).json({
    status: 'success',
    data: {
      event: null,
    },
  });
});
