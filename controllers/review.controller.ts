import Review from '../models/review.model';
import { AppError } from '../utils/AppError';
import { catchAsyncError } from '../utils/catchAsyncError';
import { parseData } from '../utils/helpers';
import * as factory from './factory';

export const getReviews = factory.getAll(Review);

export const getReview = factory.getOne(Review);

export const postReview = catchAsyncError(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user?._id;

  const data = req.body;
  const review = await Review.create(data);

  res.status(201).json({
    status: 'success',
    data: review,
  });
});

export const canUpdate = catchAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Invalid id', 400));
  //@ts-ignore
  if (review.user._id !== req.user!._id)
    return next(new AppError("Can not update other user's review", 401));

  next();
});
export const updateReview = factory.update(Review);

export const deleteReview = factory.deleteOne(Review);
