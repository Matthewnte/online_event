const mongoose = require('mongoose');

const categoriesEnum = ['sport', 'social', 'business', 'tech'];

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Event must have a name',
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: 'Event must have a category',
      enum: categoriesEnum,
    },
    platform: { type: String, required: 'Event must have venue' },
    image: { type: String, required: 'Event must have a cover image' },
    description: { type: String, trim: true },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    startDate: { type: [Date], required: 'Event must have a start Date' },
    price: Number,
    maxNumberOfAttendees: { type: Number },
    status: { type: Boolean, default: true },
    feedBacks: [String],
    createdAt: { type: Date, default: Date.now() },
    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate
eventSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'event',
  localField: '_id',
});

// eventSchema.virtual('categories', {
//   ref: 'Category',
//   foreignField: 'event',
//   localField: '_id',
// });

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'host',
    select: '-__v -passwordChangedAt',
  });

  next();
});

module.exports = mongoose.model('Event', eventSchema);
