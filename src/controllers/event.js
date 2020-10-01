const Event = require('../models/eventModel');

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
      status: 'failed',
      error,
    });
  }
};
