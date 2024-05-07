import jwt from 'jsonwebtoken';
import { AppError } from './appError';

export interface DbParams {
  username: string;
  password: string;
  host: string;
  port: number;
  name: string;
}

export function extractDbParamsFromToken(token: string): DbParams | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    if (!decoded.username || !decoded.password) {
      throw new Error("Token is missing necessary user data");
    }
    return {
      username: decoded.username,
      password: decoded.password,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      name: process.env.DATABASE_NAME,
    };
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new AppError('Invalid token', 401);
  }
}
