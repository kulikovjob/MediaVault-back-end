/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
// eslint-disable-next-line import/prefer-default-export

interface UserLogin
  extends Partial<Omit<IUser, 'passwordConfirm' | 'name' | 'photo'>> {}

interface UserUpdatePassword
  extends Pick<IUser, 'password' | 'passwordConfirm'> {
  newPassword: string;
}

export interface IUser {
  username: string;
  password: string;
}

const isProduction = process.env.NODE_ENV === 'production';
const signToken = ({
  username,
  port,
  host,
  name,
  password,
}: {
  username: string;
  password: string;
  host: string;
  name: string;
  port: string;
}): string =>
  jwt.sign(
    { username, port, host, name, password },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

const createSendToken = (user: IUser, res: Response) => {
  const token = signToken({
    ...user,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 24 * 60 * 60 * 100,
    ),
    secure: isProduction,
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  return res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// TODO: CREATE LOGIC FOR SIGNUP
// export const signup = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const newUser = await User.create({
//     //   name: req.body.name,
//     //   email: req.body.email,
//     //   password: req.body.password,
//     //   passwordConfirm: req.body.passwordConfirm,

//     //   role: req.body.role,
//     // });

//     return createSendToken(newUser, 201, res);
//   },
// );

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(
        new AppError(
          'Please provide both email and password in the request body.',
          400,
        ),
      );
    }

    return createSendToken(req.body, res);
  },
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      return next(new AppError('Access denied!', 401));
    }

    const token = req.headers.authorization.replace(/Bearer /, '');

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
    ) as jwt.JwtPayload;

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does not longer exist',
          401,
        ),
      );
    }

    const isUserChangedPassword = currentUser.changedPasswordAfter(decoded.iat);

    if (isUserChangedPassword) {
      return next(
        new AppError(
          'Invalid token. You need to log in again after changing the password!',
          401,
        ),
      );
    }

    // Grant access to protected route
    req.auth = currentUser;
    next();
  },
);

// export const restrictTo =
//   (...roles: UserRoles[]) =>
//     (req: Request, res: Response, next: NextFunction) => {
//       const isUserHavePermission = roles.includes(req.user.role);
//       if (!isUserHavePermission) {
//         return next(
//           new AppError('You do not have permission to perform this action', 403),
//         );
//       }

//       return next();
//     };
