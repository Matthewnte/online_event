const Event = require('../models/eventModel');

exports.createEvent = async (req, res) => {
  try {
    const reqBody = { ...req.body, category: req.body.category.toLowerCase() };
    const event = await Event.create(reqBody);
    return res.status(201).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      error,
    });
  }
};
