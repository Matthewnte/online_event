const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/authHandler');

router.get('/', authMiddleware.authCheck, userController.getAllUsers);
router.get('/:id', authMiddleware.authCheck, userController.getUser);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/refresh-token', authMiddleware.authCheck, authController.refreshToken);

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
router.delete(
  '/deleteUser',
  authMiddleware.authCheck,
  userController.deleteUser,
);

module.exports = router;
