const express = require('express');

const router = express.Router();

const eventController = require('../controllers/event');

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

module.exports = router;
