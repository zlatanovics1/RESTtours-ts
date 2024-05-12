import express = require('express');
import * as tourController from './../controllers/tour.controller';
import * as authController from './../controllers/auth.controller';

const tourRouter = express.Router();

tourRouter
  .get('/', authController.protectRoute, tourController.getAllTours)
  .post('/', authController.protectRoute, tourController.postTour);

tourRouter.get('/:id', tourController.getTour);

tourRouter.get('/tours-stats', tourController.getToursStats);
tourRouter.get('/monthly-plan/:year', tourController.getMonthlyPlan);

export default tourRouter;
