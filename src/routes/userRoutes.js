const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/authHandler');
const multer = require('../middleware/multer');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this meddleware
router.use(authMiddleware.authCheck);

router.patch(
  '/updatePassword',
  authMiddleware.authCheck,
  authController.updatePassword,
);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', multer.uploadSingle, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(authMiddleware.restrictTo('admin'), userController.updateUser)
  .delete(authMiddleware.restrictTo('admin'), userController.deleteUser);

module.exports = router;
