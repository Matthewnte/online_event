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

reviewSchema.static.calcAverageRatings = async function (eventId) {
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

  await Event.findByIdAndUpdate(eventId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[1].avgRAting,
  });
};

reviewSchema.post('save', function () {
  // this points to the current review
  this.constructor.Review.calcAverageRatings(this.event);
});

module.exports = mongoose.model('Review', reviewSchema);
