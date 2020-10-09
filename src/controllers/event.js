const Event = require('../models/eventModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.categoryToLowerCase = (req, res, next) => {
  req.body = { ...req.body, category: req.body.category.toLowerCase() };
  next();
};

exports.createEvent = factory.createOne(Event);

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

exports.getEvent = factory.getOne(Event, { path: 'reviews' });

exports.updateEvent = factory.updateOne(Event);

exports.deleteEvent = factory.deleteOne(Event);
