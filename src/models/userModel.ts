import dotenv from 'dotenv';
import { User } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';
import { BaseModel } from './baseModel';

dotenv.config({ path: './.env' });

export class UserModel extends BaseModel{
    //db = getDatabaseInstance();
    async getAllUsers() {
        return this.db.manyOrNone(`
            SELECT user_id, first_name, second_name, email, username, registration_date, position 
            FROM "User";
        `)
    }

    async getUserForCurrentUser() {
        return this.db.oneOrNone(`
            Select * from get_user_by_current_user();
        `);
    }

    async userActivity() {
        return this.db.oneOrNone(`
            Select * from UserActivity;
        `);
    }

    async getUserById(userId: string) {
        return this.db.oneOrNone(`
            SELECT user_id, first_name, second_name, email, username, registration_date 
            FROM "User"
            WHERE user_id = $1
        `, userId)
    }

    async deleteUserById(userId: string) {
        return this.db.none(
        'DELETE FROM public."User" WHERE user_id = $1',
        [userId],
        );
    }
}