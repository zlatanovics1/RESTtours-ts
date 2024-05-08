import { ControllerHandler } from '../types/controllers.types';

export const catchAsyncError = (fn: ControllerHandler): ControllerHandler => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};
