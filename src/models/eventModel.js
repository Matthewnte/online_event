const mongoose = require('mongoose');

const categories = ['sport', 'social', 'business', 'tech'];

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Event must have a name',
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: 'Event must have a category',
    enum: categories,
  },
  platform: { type: String, required: 'Event must have venue' },
  image: { type: String, required: 'Event must have an image' },
  description: { type: String, trim: true },
  ratingAverage: { type: Number, default: 4.5 },
  ratingQuantity: { type: Number, default: 0 },
  startDate: { type: Date, required: 'Event must have a start Date' },
  price: Number,
  maxNumberOfAttendees: { type: Number },
  status: { type: Boolean, default: true },
});

module.exports = mongoose.model('Event', eventSchema);
