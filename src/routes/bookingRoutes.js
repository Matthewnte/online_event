const express = require('express');

const bookingController = require('../controllers/booking');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

router.post('/', authHandler.authCheck, bookingController.createBooking);

// router.route('/').get(categoryController.getAllCategories).post(
//   authHandler.authCheck,
//   // categoryController.setEventUserIds,
//   authHandler.restrictTo('admin'),
//   categoryController.createCategory
// );

// router
//   .route('/:id')
//   .get(categoryController.getCategory)
//   .patch(categoryController.updateCategory)
//   .delete(
//     authHandler.authCheck,
//     authHandler.restrictTo('user', 'admin'),
//     categoryController.deleteCategory
//   );

module.exports = router;
