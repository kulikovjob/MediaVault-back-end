//import pgPromise, { IDatabase } from 'pg-promise';
//import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class BaseModel {
  db;

  constructor(
    username: string,
    name: string,
    password: string,
    port: string,
    host: string,
  ) {
    this.db = getDatabaseInstance({ name, password, host, port, username });
  }

  
}
