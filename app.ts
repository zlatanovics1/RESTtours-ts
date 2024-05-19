import express from 'express';
import globalErrorHandler from './controllers/error.controller';
import tourRouter from './routers/tour.router';
import userRouter from './routers/user.router';
import { AppError } from './utils/AppError';

// security
import xss = require('express-xss-sanitizer');
import hpp = require('hpp');
import sanitize = require('express-mongo-sanitize');
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import reviewRouter from './routers/review.router';

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // one hour,
  message: 'Too many requests from one IP address. Try again later.',
});

const app = express();

app.use(express.json({ limit: '10kb' }));

// security middlewares
//
// http security
app.use(helmet());

// cross side scripting
app.use(xss.xss());

// parameter pollution
app.use(hpp());

// noSQL injections
app.use(sanitize());

// limiting api requests
app.use('/api', limiter);
//
////

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// unknown route
app.use('*', (req, res, next) => {
  return next(new AppError('Unknown route', 404));
});

// global error handling
app.use(globalErrorHandler);

export default app;
