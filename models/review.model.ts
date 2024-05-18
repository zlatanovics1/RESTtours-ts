import mongoose, { Query } from 'mongoose';
import { IReview } from '../types/models.types';

const ReviewSchema = new mongoose.Schema<IReview>({
  review: {
    type: String,
    required: [true, 'Please leave a review'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must have a user'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must have a tour'],
  },
});


ReviewSchema.pre(
  /^find/,
  function (this: Query<IReview[] | IReview, IReview>, next) {
    this.populate({ path: 'user', select: '-__v -passwordChangedAt' })

    next();
  },
);

const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);

export default ReviewModel;
