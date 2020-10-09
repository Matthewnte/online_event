const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.createReview = catchAsyncError(async (req, res, next) => {
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;
  if (req.body.rating === '') return next(new AppError('Please rating the event'));

  const newReview = await Review.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

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
