import { ControllerHandler } from '../types/controllers.types';
import TourModel from '../models/tour.model';
import { catchAsyncError } from '../utils/catchAsyncError';
import { AppError } from '../utils/AppError';
import { parseInput } from '../utils/helpers';

//
// GET REQUESTS
//
export const getAllTours = catchAsyncError(async (req, res) => {
  const tours = await TourModel.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

export const getTour = catchAsyncError(async (req, res, next) => {
  const tour = await TourModel.findById(req.params.id).select('-__v');

  if (!tour) return next(new AppError('Tour not found', 404));

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

export const getMonthlyPlan = catchAsyncError(async (req, res, next) => {});

//
// POST (PATCH) REQUESTS
//
export const postTour = catchAsyncError(async (req, res, next) => {
  const data = parseInput(
    req.body,
    'name duration maxGroupSize difficulty ratingsAverage ratingsQuantity price priceDiscount summary description imageCover images startDates',
  );

  const newTour = await TourModel.create(data);

  const newTourSerialized = newTour.toObject();

  res.status(201).json({
    status: 'success',
    data: newTourSerialized,
  });
});
