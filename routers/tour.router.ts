import express = require('express');
import * as tourController from './../controllers/tour.controller';
import * as authController from './../controllers/auth.controller';
import reviewRouter from './review.router';

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews/:reviewId', reviewRouter);

tourRouter
  .route('/tours-within/distance/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithinDistance);
tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getToursDistance);

tourRouter.route('/:id').get(tourController.getTour);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protectRoute, tourController.postTour)
  .patch(authController.protectRoute, tourController.updateTour);

tourRouter.route('/tours-stats').get(tourController.getToursStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protectRoute,
    authController.provideRoles('admin', 'lead-guide'),
    tourController.getMonthlyPlan,
  );

export default tourRouter;
