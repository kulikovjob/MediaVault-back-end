import pgPromise, { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sessionStorage from '../SessionStorage';

dotenv.config({ path: './.env' });

let instance: IDatabase<object, IClient> | null = null;

export const getDatabaseInstance = (url?: string): IDatabase<object, IClient> => {
  const connectionUrl = url;
  if (!connectionUrl) {
    throw new Error('Connection string is required');
  }
  const pgp = pgPromise({});
  return pgp(connectionUrl);
};

export const getDatabaseConnectionUrl = (username: string, password: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedPassword = hash.digest('hex');
  return `postgres://${username}:${hashedPassword}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
};
