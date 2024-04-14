import dotenv from 'dotenv';
import { Comment, Tag } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

export class CommentModel {
  db = getDatabaseInstance();

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

  async getCommentById(commentId: string) {
    return this.db.oneOrNone(
      `
      SELECT c.comment_id, mf.file_name, u.first_name, u.second_name, c.comment_text
      FROM Comment c
      INNER JOIN MultimediaFile mf ON c.file_id = mf.file_id
      INNER JOIN "User" u ON c.user_id = u.user_id
      WHERE c.comment_id = $1
      `,
      [commentId]
    );
  }

  async addNewComment(data: Partial<Comment>) {
    return this.db.one(
      'SELECT add_comment($1, $2)',
      [data.file_id, data.comment_text],
    );
  }

  async updateComment(commentId: string, newData: any) {
    return this.db.one(
      `
    UPDATE "comment"
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
    return this.db.none(
      'DELETE FROM public."comment" WHERE comment_id = $1',
      [commentId],
    );
  }

}