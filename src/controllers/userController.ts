/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { User  } from '../types/types';
import { UserModel } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const User = new UserModel();

interface RequestParams {
  userId: string
}

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.getAllUsers(); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: users.length, data: { users } });
  },
);

export const getUserForCurrentUser = catchAsync(
  async (req: Request, res: Response) => {
    const user = await User.getUserForCurrentUser();

    res
      .status(200)
      .json({ status: 'success', length: user.length, data: { user } });
  },
);

export const getUserById = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await User.getUserById(userId);

    res
      .status(200)
      .json({ status: 'success', length: user.length, data: { user } });
  },
);

export const deleteUserById = catchAsync(
  async (req: Request<RequestParams>, res: Response) => {
    const { userId } = req.params;
    await User.deleteUserById(userId);

    res
      .status(200)
      .json({ status: 'success', message: 'User deleted successfully' });
  },
);