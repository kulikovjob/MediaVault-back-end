// databaseUtils.ts
import pgPromise, { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';
import sessionStorage from '../SessionStorage';

dotenv.config({ path: './.env' });

let instance: IDatabase<object, IClient> | null = null;

export const getDatabaseInstance = (url?: string): IDatabase<object, IClient> => {
  const connectionUrl = url  || john;
  if (!connectionUrl) {
    throw new Error('Connection string is required');
  }
  const pgp = pgPromise({});
  return pgp(connectionUrl);
};

export const getDatabaseConnectionUrl = (username: string, password: string): string =>
  `postgres://${username}:${password}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

const connectingString = getDatabaseConnectionUrl('Vadim', '123');
const john = getDatabaseConnectionUrl('john_doe', '123');
const alex = getDatabaseConnectionUrl('alex_johnson', '456');
const alice = getDatabaseConnectionUrl('alice_williams', '123');
const frank = getDatabaseConnectionUrl('frank_miller', '123');
const jane = getDatabaseConnectionUrl('jane_smith', '123');
