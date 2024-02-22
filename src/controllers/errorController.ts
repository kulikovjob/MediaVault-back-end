/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { ApplicationPhaces } from '../types/types';

const sendErrorDev = (err: AppError, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error('ERROR 💥', err.message);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

// eslint-disable-next-line import/prefer-default-export
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === ApplicationPhaces.Development) {
    return sendErrorDev(err, res);
  }

  const handledError = { ...err };

  return sendErrorProd(handledError, res);
}
