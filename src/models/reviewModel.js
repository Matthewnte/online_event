const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  review: { type: String },
  rating: {
    type: String,
    min: 1,
    max: 5,
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Review must belong to a user',
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: 'Review must belong to a tour',
  },
  createdAt: { type: Date, default: Date.now() },
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // },
});

module.exports = mongoose.model('Review', reviewSchema);
