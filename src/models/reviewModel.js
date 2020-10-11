const mongoose = require('mongoose');
const Event = require('./eventModel');

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

reviewSchema.index({ event: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (eventId) {
  const stats = await this.aggregate([
    {
      $match: { event: eventId },
    },
    {
      $group: {
        _id: '#event',
        nRating: { $sum: 1 },
        avgRAting: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Event.findByIdAndUpdate(eventId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRAting,
    });
  } else {
    await Event.findByIdAndUpdate(eventId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to the current review
  this.constructor.calcAverageRatings(this.event);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.event);
});

module.exports = mongoose.model('Review', reviewSchema);
