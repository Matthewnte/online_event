const mongoose = require('mongoose');

const categories = ['sport', 'social', 'business', 'tech'];

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Event must have a name',
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: 'Event must have a category',
    enum: categories,
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
  reviews: String,
  feedBacks: [String],
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Event', eventSchema);
