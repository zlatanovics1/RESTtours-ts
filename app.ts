import express from 'express';
import tourRouter from './routers/tour.router';
import globalErrorHandler from './controllers/error.controller';
import { AppError } from './utils/AppError';

const app = express();

app.use(express.json());

app.use('/api/v1/tours', tourRouter);

// unknown route
app.use('*', (req, res, next) => {
  return next(new AppError('Unknown route', 404));
});

// global error handling
app.use(globalErrorHandler);

export default app;
