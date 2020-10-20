const express = require('express');

const router = express.Router();

const eventController = require('../controllers/event');
const reviewController = require('../controllers/review');
const authMiddleware = require('../middleware/authHandler');

router.get('/user', authMiddleware.authCheck, eventController.getUserEvents);

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    authMiddleware.authCheck,
    eventController.createEvent,
  );

router.post('/search', eventController.findEvents);

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    authMiddleware.authCheck,
    authMiddleware.restrictTo('admin', 'host'),
    eventController.updateEvent,
  )
  .delete(
    authMiddleware.authCheck,
    authMiddleware.restrictTo('admin', 'host'),
    eventController.deleteEvent,
  );

router
  .route('/:eventId/reviews')
  .post(
    authMiddleware.authCheck,
    authMiddleware.restrictTo('user'),
    reviewController.setEventUserIds,
    reviewController.createReview,
  );

module.exports = router;
