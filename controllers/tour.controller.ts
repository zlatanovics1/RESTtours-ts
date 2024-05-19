// import { ControllerHandler } from '../types/controllers.types';
import TourModel from '../models/tour.model';

import * as factory from './factory';
import { catchAsyncError } from '../utils/catchAsyncError';
import { parseData } from '../utils/helpers';
//
// GET REQUESTS
//
export const getAllTours = factory.getAll(TourModel);

export const getTour = factory.getOne(TourModel, { path: 'reviews' });

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
export const postTour = factory.post(TourModel);

// #TODO updateTour
export const updateTour = factory.update(TourModel);
// #TODO deleteTour
