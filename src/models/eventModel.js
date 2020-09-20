const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  name: { type: String, required: 'Event must have a name', trim: true },
  event: { type: String, required: 'Event must have venue' },
  image: { type: String, required: 'Event must have an image' },
  description: { type: String, trim: true },
  ratingAverage: { type: Number, default: 4.5 },
  ratingQuantity: { type: Number, default: 0 },
  eventStartTime: { type: Date, required: 'Event must have a start time' },
  price: Number,
});

module.exports = mongoose.model('Event', eventSchema);
