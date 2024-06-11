import express = require('express');
import * as reviewController from '../controllers/review.controller';
import * as authController from '../controllers/auth.controller';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protectRoute,
    authController.provideRoles('user'),
    reviewController.postReview,
  );
reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.protectRoute,
    authController.provideRoles('user', 'admin'),
    reviewController.canUpdate,
    reviewController.updateReview,
  )
  .delete(
    authController.protectRoute,
    authController.provideRoles('lead-guide', 'admin'),
    reviewController.deleteReview,
  );

export default reviewRouter;
