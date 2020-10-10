const express = require('express');

const categoryController = require('../controllers/category');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

router.route('/').get(categoryController.getAllCategories).post(
  authHandler.authCheck,
  // categoryController.setEventUserIds,
  authHandler.restrictTo('admin'),
  categoryController.createCategory,
);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(
    authHandler.authCheck,
    authHandler.restrictTo('user', 'admin'),
    categoryController.deleteCategory,
  );

module.exports = router;
