import dotenv from 'dotenv';
import { User } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class UserModel {
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

  async getAllUsers() {
    return this.db.manyOrNone(`
            SELECT user_id, first_name, second_name, email, username, registration_date 
            FROM "User";
        `);
  }

  async getUserForCurrentUser() {
    return this.db.oneOrNone(`
            Select * from get_user_by_current_user();
        `);
  }

  async getUserById(userId: string) {
    return this.db.oneOrNone(
      `
            SELECT user_id, first_name, second_name, email, username, registration_date 
            FROM "User"
            WHERE user_id = $1
        `,
      userId,
    );
  }

  async deleteUserById(userId: string) {
    return this.db.none('DELETE FROM public."User" WHERE user_id = $1', [
      userId,
    ]);
  }
}
