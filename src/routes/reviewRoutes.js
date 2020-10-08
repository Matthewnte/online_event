const express = require('express');

const reviewController = require('../controllers/review');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authHandler.authCheck,
    authHandler.restrictTo('user'),
    reviewController.createReview,
  );

module.exports = router;
