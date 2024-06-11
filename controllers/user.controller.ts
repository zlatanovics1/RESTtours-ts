import { type NextFunction, type Request, type Response } from 'express';
import User from '../models/user.model';
import * as factory from './factory';

export const getUsers = factory.getAll(User);

export const getUser = factory.getOne(User);

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user?._id;
  next();
};
