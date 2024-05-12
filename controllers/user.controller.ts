import UserModel from '../models/user.model';
import { catchAsyncError } from '../utils/catchAsyncError';

export const getUsers = catchAsyncError(async (req, res, next) => {
  const users = await UserModel.find();

  res.status(200).json({
    status: 'success',
    data: users,
  });
});
