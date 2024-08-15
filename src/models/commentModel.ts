import dotenv from 'dotenv';
import { Comment, Tag } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';
import { BaseModel } from './baseModel';

dotenv.config({ path: './.env' });

export class CommentModel extends BaseModel{
  //db = getDatabaseInstance();

  async getAllComments() {
    return this.db.manyOrNone(
      `
      SELECT c.comment_id, mf.file_name, u.first_name, u.second_name, c.comment_text
      FROM Comment c
      INNER JOIN MultimediaFile mf ON c.file_id = mf.file_id
      INNER JOIN "User" u ON c.user_id = u.user_id
      `
    );
  }

  async getCommentsByFileId(fileId: string) {
    return this.db.manyOrNone(
      `
      SELECT c.comment_id, mf.file_name, u.first_name, u.second_name, c.comment_text
      FROM Comment c
      INNER JOIN MultimediaFile mf ON c.file_id = mf.file_id
      INNER JOIN "User" u ON c.user_id = u.user_id
      WHERE c.file_id = $1
      ORDER BY c.comment_id DESC
      `,
      [fileId]
    );
  }


  async addNewComment(data: Partial<Comment>) {
    return this.db.one(
      'SELECT add_comment($1, $2)',
      [data.file_id, data.comment_text],
    );
  }

  async updateComment(commentId: string, newData: any) {
    // Отримуємо ідентифікатор поточного користувача
    const currentUser = await this.db.one(
      `
      SELECT u.user_id
      FROM "User" u
      WHERE u.username = current_user;
    `
    );

    // Отримуємо інформацію про коментар
    const comment = await this.db.oneOrNone(
      `
      SELECT user_id
      FROM comment
      WHERE comment_id = $1
    `,
      [commentId]
    );

    // Перевіряємо, чи існує коментар
    if (!comment) {
      throw new Error('Коментар не знайдено');
    }

    // Перевіряємо, чи користувач є автором коментаря
    if (comment.user_id !== currentUser.user_id) {
      throw new Error('Ви не є автором цього коментаря');
    }

    // Оновлюємо коментар
    return this.db.one(
      `
      UPDATE comment
      SET ${Object.keys(newData)
        .filter(key => newData[key] !== undefined)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')}
      WHERE comment_id = $${Object.keys(newData).length + 1}
      RETURNING *;
    `,
      [...Object.values(newData).filter(value => value !== undefined), commentId]
    );
  }


  async deleteCommentById(commentId: string) {
    // Отримуємо ідентифікатор поточного користувача
    const currentUser = await this.db.one(
      `
      SELECT u.user_id
      FROM "User" u
      WHERE u.username = current_user;
    `
    );

    // Отримуємо інформацію про коментар
    const comment = await this.db.oneOrNone(
      `
      SELECT user_id
      FROM comment
      WHERE comment_id = $1
    `,
      [commentId]
    );

    // Перевіряємо, чи існує коментар
    if (!comment) {
      throw new Error('Коментар не знайдено');
    }

    // Перевіряємо, чи користувач є автором коментаря
    if (comment.user_id !== currentUser.user_id) {
      throw new Error('Ви не є автором цього коментаря');
    }
    return this.db.none(
      'DELETE FROM public."comment" WHERE comment_id = $1',
      [commentId],
    );

    // return this.db.none(
    //   'SELECT delete_comment_by_id($1)',
    //   [commentId]
    // );
  }

}