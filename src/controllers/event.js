const Event = require('../models/eventModel');
const config = require('../config');

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};