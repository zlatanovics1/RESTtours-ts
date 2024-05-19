import User from '../models/user.model';
import * as factory from './factory';

export const getUsers = factory.getAll(User);

export const getUser = factory.getOne(User);
