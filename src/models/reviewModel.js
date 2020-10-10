const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: { type: String },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'Review must belong to a user',
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: 'Review must belong to an event',
    },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

module.exports = mongoose.model('Review', reviewSchema);
