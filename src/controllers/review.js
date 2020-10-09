const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsyncError(async (req, res) => {
  const reviews = await Review.find();

  return res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setEventUserIds = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReviews = factory.updateOne(Review);

exports.deleteReviews = factory.deleteOne(Review);
