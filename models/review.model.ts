import mongoose, { Query } from 'mongoose';
import { IReview } from '../types/models.types';
import TourModel from './tour.model';

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

ReviewSchema.index({ user: 1, tour: 1 }, { unique: true });

ReviewSchema.statics.updateTourStats = async function (
  tourId: typeof mongoose.Schema.ObjectId,
) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRatings: { $avg: 'rating' },
      },
    },
  ]);
  await TourModel.findByIdAndUpdate(tourId, {
    ratingsAverage: stats?.[0]?.avgRatings || 4.5,
    ratingsQuantity: stats?.[0]?.numRatings || 0,
  });
  console.log(stats);
};

ReviewSchema.post('save', function () {
  //@ts-ignore-next-line
  this.constructor.updateTourStats();
});

ReviewSchema.pre(
  /^findOneAnd/,
  async function (this: Query<IReview, IReview>, next) {
    // this -> query
    //@ts-ignore
    this.reviewDoc = await this.findOne();

    next();
  },
);

ReviewSchema.post(/^findOneAnd/, function (this: Query<IReview, IReview>) {
  // this -> executed query!
  //@ts-ignore
  this.reviewDoc.constructor.updateTourStats(this.reviewDoc.tour);
});

ReviewSchema.pre(
  /^find/,
  function (this: Query<IReview[] | IReview, IReview>, next) {
    this.populate({ path: 'user', select: 'name email' });

    next();
  },
);

const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);

export default ReviewModel;
