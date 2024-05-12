import { Document, Model } from 'mongoose';

export interface ITour extends Document {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: 'difficult' | 'medium' | 'easy';
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  createdAt: Date;
}

export interface IUserSafe extends Document {
  name: string;
  email: string;
  resetToken?: string;
  refreshToken?: string;
  resetTokenExpires: Date;
  createdAt: Date;
  role: string;
}

export interface IUserMethods {
  hasChangedPassword(iat: number): boolean;
  correctPassword(password: string): boolean;
  generatePasswordResetToken(): string;
}

export interface IUser extends IUserSafe, IUserMethods {
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
