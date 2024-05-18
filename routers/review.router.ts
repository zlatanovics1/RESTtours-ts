import express = require('express');
import * as reviewController from './../controllers/review.controller';
import * as authController from './../controllers/auth.controller';

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(reviewController.getReviews)
  .post(reviewController.postReview);
reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(
    authController.protectRoute,
    authController.provideRoles('lead-guide', 'admin'),
    reviewController.deleteReview,
  );
