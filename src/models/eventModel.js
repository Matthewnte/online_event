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
      type: [String],
      required: 'Event must have a category',
      enum: categoriesEnum,
      set: (val) => (val.map((el) => el.toLowerCase())),
    },
    platform: { type: String, required: 'Event must have venue' },
    image: { type: String, required: 'Event must have a cover image' },
    imageId: { type: String },
    description: { type: String, trim: true },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must not be below 1'],
      max: [5, 'Rating must not be above 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    startDate: { type: [Date], required: 'Event must have a start Date' },
    price: Number,
    maxNumberOfAttendees: { type: Number },
    status: { type: Boolean, default: true },
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
