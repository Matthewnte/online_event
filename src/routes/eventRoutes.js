const express = require('express');

const router = express.Router();

const eventController = require('../controllers/event');
const authMiddleware = require('../middleware/authHandler');

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(authMiddleware.authCheck, eventController.createEvent);

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    authMiddleware.authCheck,
    authMiddleware.restrictTo('admin, host'),
    eventController.updateEvent,
  )
  .delete(
    authMiddleware.authCheck,
    authMiddleware.restrictTo('admin, host'),
    eventController.deleteEvent,
  );

module.exports = router;
