const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setEventUserIds = (req, res, next) => {
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReviews = factory.updateOne(Review);

exports.deleteReviews = factory.deleteOne(Review);
