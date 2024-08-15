import { IDatabase, IClient } from 'pg-promise/typescript/pg-subset';

declare module 'express-serve-static-core' {
  interface Request {
    db?: IDatabase<object, IClient>;
  }
}
