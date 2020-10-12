const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: 'Booking must belong to an Event',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Booking must belong to a user',
  },
  isPaid: { type: Boolean, default: false },
  price: Number,
  paid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'event',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
