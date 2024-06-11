import express = require('express');
import * as userController from './../controllers/user.controller';
import * as authController from './../controllers/auth.controller';
const userRouter = express.Router();

/// AUTHENTICATION
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/logout', authController.logout);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protectRoute);

userRouter.route('/').get(userController.getUsers);
userRouter.route('/:id').get(userController.getUser);
userRouter.route('/me').get(userController.getMe, userController.getUser);

userRouter.patch('/updatePassword', authController.updatePassword);

export default userRouter;
