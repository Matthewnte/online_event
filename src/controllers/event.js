const Event = require('../models/eventModel');
const ApiFeatures = require('../utils/apiFeatures');

exports.createEvent = async (req, res) => {
  try {
    const reqBody = { ...req.body, category: req.body.category.toLowerCase() };
    const newEvent = await Event.create(reqBody);
    return res.status(201).json({
      status: 'success',
      data: {
        event: newEvent,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    // Execute query
    const features = new ApiFeatures(Event.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const events = await features.query;

    // Send response
    return res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const tour = await Event.findById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'success',
      data: {
        event: null,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
