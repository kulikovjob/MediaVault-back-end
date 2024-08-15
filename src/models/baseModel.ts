// // baseModel.ts
//
// @ts-ignore
import { IDatabase, IClient } from 'pg-promise/typescript/pg-subset';
import { getDatabaseInstance } from '../utils/databaseUtils';
//import {authenticateUser} from '../controllers/authController';

export class BaseModel {
  db: IDatabase<object, IClient>;

  constructor() {
    this.db = getDatabaseInstance();
  }
}
//
// // baseModel.ts
// // @ts-ignore
// import { IDatabase, IClient } from 'pg-promise/typescript/pg-subset';
// import { getDatabaseInstance } from '../utils/databaseUtils';
// import sessionStorage from '../SessionStorage';
//
// export class BaseModel {
//   db: IDatabase<object, IClient>;
//
//   constructor() {
//     const connectionString = sessionStorage.getConnectionString();
//     this.db = getDatabaseInstance(connectionString);
//   }
// }
//
//

// baseModel.ts
// @ts-ignore
// baseModel.ts
// import { IDatabase, IClient } from 'pg-promise/typescript/pg-subset';
// import { getDatabaseInstance } from '../utils/databaseUtils';
// import ConnectionManager from '../utils/connectionManager'; // Импортируем наш синглтон
//
// export class BaseModel {
//   protected db: IDatabase<object, IClient>;
//
//   constructor() {
//     const connectionString = ConnectionManager.getConnectionString();
//     this.db = getDatabaseInstance(connectionString);
//   }
// }

// baseModel.ts
// import { IDatabase, IClient } from 'pg-promise/typescript/pg-subset';
// import { getDatabaseInstance } from '../utils/databaseUtils';
//
//
// export class BaseModel {
//   protected db: IDatabase<object, IClient>;
//
//   constructor() {
//     this.db = getDatabaseInstance();
//   }
// }


