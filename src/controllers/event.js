const Event = require('../models/eventModel');
const factory = require('./handlerFactory');

exports.categoryToLowerCase = (req, res, next) => {
  req.body = { ...req.body, category: req.body.category.toLowerCase() };
  next();
};

exports.getAllEvents = factory.getAll(Event);

exports.getUserEvents = factory.getUserEvents(Event);

exports.createEvent = factory.createOne(Event);

exports.getEvent = factory.getOne(Event, { path: 'reviews' });

exports.updateEvent = factory.updateOne(Event);

exports.deleteEvent = factory.deleteOne(Event);
