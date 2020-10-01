const express = require('express');

const router = express.Router();

const eventController = require('../controllers/event');

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(eventController.updateEvent);

module.exports = router;
