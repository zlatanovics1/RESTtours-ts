import express = require('express');
import * as tourController from './../controllers/tour.controller';
import * as authController from './../controllers/auth.controller';
import reviewRouter from './review.router';

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews/:reviewId', reviewRouter);

tourRouter
  .route('/')
  .get(authController.protectRoute, tourController.getAllTours)
  .post(authController.protectRoute, tourController.postTour)
  .patch(authController.protectRoute, tourController.updateTour);

tourRouter.route('/:id').get(tourController.getTour);

tourRouter.route('/tours-stats').get(tourController.getToursStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

export default tourRouter;
