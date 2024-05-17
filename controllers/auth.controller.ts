import { NextFunction, Request, Response } from 'express';
import jwt = require('jsonwebtoken');
import UserModel from '../models/user.model';
import { IUser, IUserSafe } from '../types/models.types';

import { catchAsyncError } from '../utils/catchAsyncError';
import { hashToken, parseData, verifyToken } from '../utils/helpers';
import { AppError } from '../utils/AppError';
import { sendMail } from '../utils/sendEmail';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

function createSendJWT(user: IUserSafe, res: Response) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });

  const cookieOptions = {
    httpOnly: true,
    expiresIn: +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  res.status(200).json({
    status: 'success',
    user,
    token,
  });
}

export const signup = catchAsyncError(async (req, res, next) => {
  const data = parseData(req.body, 'name email password passwordConfirm');
  // create user
  const newUser = await UserModel.create(data);

  //@ts-ignore
  const newUserSafe = parseData(newUser._doc, 'name email role _id');

  // create and send jwt
  createSendJWT(newUserSafe, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = (await UserModel.find({ email }).select('+password'))[0];

  if (!user || !(await user.correctPassword(password)))
    return next(new AppError('Invalid email or password', 400));

  //@ts-ignore
  const userSafe = parseData(user._doc, 'name email role _id');

  createSendJWT(userSafe, res);
});

// forgotPassword
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  // check user
  const { email } = req.body.email;
  const user = (await UserModel.find({ email }))[0];
  if (!user) return next(new AppError('Invalid email', 400));

  // generate token
  const token = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send link via email
  const resetLink = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`;

  try {
    await sendMail({
      to: email,
      subject: 'Password reset link',
      message: `
        Here is your password reset link:
        ${resetLink}
        It expires in 10 minutes.
        If you didn't request it, simply ignore this mail.`,
    });
    res.status(200).json({
      status: 'success',
      message: `Reset link sent successfully to ${email}.`,
    });
  } catch {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send mail. Try again later.',
    });
  }
});

// resetPassword
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token: reqToken } = req.params;
  const { password, passwordConfirm } = req.body;

  // hash token
  const hashedToken = hashToken(reqToken.trim());

  // find user with currently active hashedToken
  const user = (
    await UserModel.find({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() },
    })
  )[0];

  if (!user) return next(new AppError('Invalid token!', 400));

  // set new password and save
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();
  //@ts-ignore
  const userSafe = parseData(user._doc, 'name email role _id');
  createSendJWT(userSafe, res);
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  // since route is protected, user exists on req
  const { password, newPassword, newPasswordConfirm } = req.body;
  const user = (await UserModel.findById(req.user!.id).select('+password'))!;

  const validPass = user.correctPassword(password);
  if (!validPass) return next(new AppError('Invalid password!', 400));
  const isSamePass = user.correctPassword(newPassword);
  if (isSamePass)
    return next(new AppError('Can not reuse same password twice!', 400));

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.save();

  //@ts-ignore
  const userSafe = parseData(user._doc, 'name email role _id');
  createSendJWT(userSafe, res);
});

//
// route protection
//
export const protectRoute = catchAsyncError(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(new AppError('Please log in to get access', 401));

  const token = req.headers.authorization.split('Bearer ')[1];

  const { iat, id } = await verifyToken(token);

  const user = await UserModel.findById(id);

  if (!user)
    return next(new AppError('Token does not belong to any user', 401));

  if (user.hasChangedPassword(iat))
    return next(new AppError('User has changed password', 401));

  req.user = user;

  next();
});

export const provideRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      return next(new AppError('Route access denied', 403));

    next();
  };
};
