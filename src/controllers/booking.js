const Booking = require('../models/bookingModel');
// const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.createBooking = factory.createOne(Booking);
