import express = require('express');
import * as userController from './../controllers/user.controller';
import * as authController from './../controllers/auth.controller';
const userRouter = express.Router();

userRouter.get('/', userController.getUsers);

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
