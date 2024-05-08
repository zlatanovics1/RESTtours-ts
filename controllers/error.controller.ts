import { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/AppError';

const handleCastError = (err: any) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFields = (err: any) => {
  const errorFields = JSON.stringify(err.keyValue)
    .replace(/"/g, '')
    .replace(/[{}]/g, '');
  return new AppError(`Duplicate fields | ${errorFields}`, 400);
};

const handleValidationError = (err: any) => {
  const validationErrors = Object.values(err.errors)
    .map((error: any) => error.message)
    .join('. ');

  return new AppError(`Invalid input: ${validationErrors}`, 400);
};

const handleTokenExpiredError = () => new AppError('Token has expired!', 401);

const handleInvalidTokenError = () => new AppError('Invalid token', 401);

function sendDevError(err: any, res: Response) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stackTrace: err.stack,
  });
}

function sendProdError(err: any, res: Response) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
}

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode ||= 500;
  err.status ||= 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    // message,name is inherited property and can't be applied with destructuring operator
    let error = { ...err, message: err.message, name: err.name };

    if (err.name === 'CastError') error = handleCastError(err);
    else if (err.code === 11000) error = handleDuplicateFields(err);
    else if (err.name === 'ValidationError') error = handleValidationError(err);
    else if (err.name === 'TokenExpiredError')
      error = handleTokenExpiredError();
    else if (err.name === 'JsonWebTokenError')
      error = handleInvalidTokenError();

    sendProdError(error, res);
  }
};
