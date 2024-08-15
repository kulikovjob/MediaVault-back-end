// @ts-ignore
import { IDatabase, IClient } from 'pg-promise/typescript/pg-subset';
import { getDatabaseInstance } from '../utils/authUtils';
import sessionStorage from '../SessionStorage';

export class BaseModel {
  db: IDatabase<object, IClient>;

  constructor() {
    const connectionString = sessionStorage.getConnectionString();
    this.db = getDatabaseInstance(connectionString);
  }
}