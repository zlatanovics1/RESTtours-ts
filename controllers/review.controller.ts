import Review from '../models/review.model';
import { AppError } from '../utils/AppError';
import { catchAsyncError } from '../utils/catchAsyncError';
import { parseData } from '../utils/helpers';

export const getReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find().select('-__v');

  res.status(200).json({
    status: 'success',
    data: reviews,
  });
});

export const getReview = catchAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id).select('-__v');

  if (!review) return next(new AppError('Invalid Id', 404));

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

export const postReview = catchAsyncError(async (req, res, next) => {
  const data = parseData(req.body, 'review rating createdAt user tour');
  const review = await Review.create(data);

  res.status(201).json({
    status: 'success',
    data: review,
  });
});

export const updateReview = catchAsyncError(async (req, res, next) => {
  const data = parseData(req.body, 'review rating');
  const review = await Review.findByIdAndUpdate(req.params.id, data).select(
    '-__v',
  );

  if (!review) return next(new AppError('Invalid Id', 404));

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

export const deleteReview = catchAsyncError(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) return next(new AppError('Invalid Id', 404));

  res.status(204).json({
    status: 'success',
  });
});
