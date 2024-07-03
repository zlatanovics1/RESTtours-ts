import mongoose from 'mongoose';
import crypto = require('crypto');
import { IUser, IUserMethods } from '../types/models.types';
import { hashPassword, hashToken, verifyPassword } from '../utils/helpers';

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'Name should be at least 3 characters long'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password should be at least characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    validator: {
      validate: function (this: IUser, val: string) {
        return this.password === val;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  resetToken: String,
  resetTokenExpires: Date,
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hashPassword(this.password);
  this.passwordConfirm = undefined;

  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // 1 sec before in order to set token issuedAt later than passwordChangedAt
  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

UserSchema.method('hasChangedPassword', function (tokenIssuedAt: number) {
  if (!this.passwordChangedAt) return false;

  const changedAt = parseInt(`${this.passwordChangedAt.getTime() / 1000}`, 10);

  return tokenIssuedAt < changedAt;
});

UserSchema.method('correctPassword', async function (password: string) {
  return await verifyPassword(password, this.password);
});

UserSchema.method('generatePasswordResetToken', function () {
  const token = crypto.randomBytes(32).toString('hex');

  const hashedToken = hashToken(token);

  this.resetToken = hashedToken;
  this.resetTokenExpires = new Date(
    Date.now() + Number(process.env.RESET_TOKEN_EXPIRES_IN!),
  );

  return token;
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
