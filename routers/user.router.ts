import express = require('express');
import * as userController from './../controllers/user.controller';
import * as authController from './../controllers/auth.controller';
const userRouter = express.Router();

userRouter.route('/').get(userController.getUsers);
userRouter.route('/:id').get(userController.getUser);

/// AUTHENTICATION
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.patch(
  '/updatePassword',
  authController.protectRoute,
  authController.updatePassword,
);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);

export default userRouter;
