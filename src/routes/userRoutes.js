const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/authHandler');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authMiddleware.authCheck,
  authController.updatePassword,
);

router.patch(
  '/updateUser',
  authMiddleware.authCheck,
  userController.updateUser,
);

module.exports = router;
