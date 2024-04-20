/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { User  } from '../types/types';
import { UserModel } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { RequestWithAuth } from '../utils/databaseUtils';



export const getAllUsers = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const users = await req.model.getAllUsers(); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: users.length, data: { users } });
  },
);

export const getUserForCurrentUser = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const user = await req.model.getUserForCurrentUser();

    res
      .status(200)
      .json({ status: 'success', length: user.length, data: { user } });
  },
);

export const getUserById = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const { userId } = req.params;
    const user = await req.model.getUserById(userId);

    res
      .status(200)
      .json({ status: 'success', length: user.length, data: { user } });
  },
);

export const deleteUserById = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const { userId } = req.params;
    await req.model.deleteUserById(userId);

    res
      .status(200)
      .json({ status: 'success', message: 'User deleted successfully' });
  },
);