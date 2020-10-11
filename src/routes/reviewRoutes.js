const express = require('express');

const reviewController = require('../controllers/review');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

router.use(authHandler.authCheck);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authHandler.restrictTo('user', 'admin'),
    reviewController.setEventUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReviews)
  .delete(
    authHandler.restrictTo('user', 'admin'),
    reviewController.deleteReviews,
  );

module.exports = router;
