import express = require('express');
import * as tourController from './../controllers/tour.controller';

const tourRouter = express.Router();

tourRouter
  .get('/', tourController.getAllTours)
  .post('/', tourController.postTour);

tourRouter.get('/:id', tourController.getTour);

tourRouter.get('/tours-stats', tourController.getToursStats);
tourRouter.get('/monthly-plan/:year', tourController.getMonthlyPlan);

export default tourRouter;
