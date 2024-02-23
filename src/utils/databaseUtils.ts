// TODO: Delete this rule in next time when this file gonna be updated
/* eslint-disable import/prefer-default-export */

import pgPromise, { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

let instance: IDatabase<object, IClient> | null = null;

export const getDatabaseInstance = (): IDatabase<object, IClient> => {
  if (!instance) {
    const url = getDatabaseConnectionUrl();
    instance = pgPromise()(url);
  }
  return instance;
};

export const getDatabaseConnectionUrl = () =>
  `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?`;


