import mongoose from 'mongoose';
import { ParsedUrlQuery } from 'querystring';
import { ControllerHandler } from '../types/controllers.types';
import { APIFeatures } from '../utils/APIFeatures';
import { catchAsyncError } from '../utils/catchAsyncError';
import { AppError } from '../utils/AppError';
import { parseData } from '../utils/helpers';

export const getAll = (Model: typeof mongoose.Model): ControllerHandler => {
  return catchAsyncError(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const ModelApiFeatures = new APIFeatures<typeof Model>(
      Model.find(filter),
      req.query as ParsedUrlQuery,
    );
    ModelApiFeatures.filter().sort().paginate().limitFields();

    const data = await ModelApiFeatures.modelQuery.select('-__v');

    res.status(200).json({
      status: 'success',
      results: data.length,
      data: { data },
    });
  });
};

export const getOne = (
  Model: typeof mongoose.Model,
  populateOptions?: any,
): ControllerHandler => {
  return catchAsyncError(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const data = await query.select('-__v');

    if (!data) return next(new AppError('Document not found', 404));

    res.status(200).json({
      status: 'success',
      data: { data },
    });
  });
};

export const post = (
  Model: typeof mongoose.Model,
  parserData?: string,
): ControllerHandler => {
  return catchAsyncError(async (req, res, next) => {
    let data = req.body;

    if (parserData) data = parseData(req.body, parserData);

    const newDoc = await Model.create(data);

    res.status(201).json({
      status: 'success',
      data: { newDoc },
    });
  });
};

export const update = (Model: typeof mongoose.Model): ControllerHandler => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    }).select('-__v');

    if (!doc) return next(new AppError('Invalid Id', 404));

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });
};

export const deleteOne = (Model: typeof mongoose.Model): ControllerHandler => {
  return catchAsyncError(async (req, res, next) => {
    let query = Model.findByIdAndDelete(req.params.id);

    const data = await query.select('-__v');

    if (!data) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
