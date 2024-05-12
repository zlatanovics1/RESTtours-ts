// import { ControllerHandler } from '../types/controllers.types';
import TourModel from '../models/tour.model';
import { ITour } from '../types/models.types';
import { ParsedUrlQuery } from 'querystring';

import { catchAsyncError } from '../utils/catchAsyncError';
import { AppError } from '../utils/AppError';
import { parseData } from '../utils/helpers';
import { APIFeatures } from '../utils/APIFeatures';
//
// GET REQUESTS
//
export const getAllTours = catchAsyncError(async (req, res) => {
  const toursAPIFeatures = new APIFeatures<ITour>(
    TourModel.find(),
    req.query as ParsedUrlQuery,
  );
  toursAPIFeatures.filter().sort().paginate().limitFields();

  const tours = await toursAPIFeatures.modelQuery;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

export const getTour = catchAsyncError(async (req, res, next) => {
  const tour = await TourModel.findById(req.params.id);

  if (!tour) return next(new AppError('Tour not found', 404));

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

export const getToursStats = catchAsyncError(async (req, res, next) => {
  const tourStats = await TourModel.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: null,
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: tourStats,
  });
});

export const getMonthlyPlan = catchAsyncError(async (req, res, next) => {
  const year = req.params.year;
  const monthlyPlan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: {
          $push: { name: '$name', duration: '$duration' },
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: monthlyPlan,
  });
});

//
// POST (PATCH) REQUESTS
//
export const postTour = catchAsyncError(async (req, res, next) => {
  const data = parseData(
    req.body,
    'name duration maxGroupSize difficulty ratingsAverage ratingsQuantity price priceDiscount summary description imageCover images startDates',
  );

  const newTour = await TourModel.create(data);

  const newTourSafeToSend = newTour.toObject();

  res.status(201).json({
    status: 'success',
    data: newTourSafeToSend,
  });
});

// #TODO updateTour

// #TODO deleteTour
