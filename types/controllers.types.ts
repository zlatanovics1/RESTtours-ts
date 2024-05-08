import { NextFunction, Request, Response } from 'express';

export type ControllerHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
