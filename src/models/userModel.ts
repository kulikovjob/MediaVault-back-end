import dotenv from 'dotenv';
import { User } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

export class UserModel {
    db = getDatabaseInstance();
    async getAllUsers() {
        return this.db.manyOrNone(`
            SELECT user_id, first_name, second_name, email, username, registration_date 
            FROM "User";
        `)
    }

    async getUserForCurrentUser() {
        return this.db.oneOrNone(`
            Select * from get_user_by_current_user();
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