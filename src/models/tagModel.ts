import dotenv from 'dotenv';
import { Tag } from '../types/types';
import { BaseModel } from './baseModel';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class TagModel extends BaseModel {
  async getAllTags() {
    return this.db.manyOrNone(
      `
      SELECT * FROM "tag"
    `);
  }

  async getTagById(tagId: string) {
    return this.db.oneOrNone(
      `
      SELECT * FROM "tag"
      WHERE tag_id = $1
    `,
      tagId,
    );
  }

  async addNewTag(data: Partial<Tag>) {
    return this.db.one(
      'INSERT INTO public."tag" (tag_name) VALUES ($1) RETURNING tag_id;',
      [...Object.values(data)],
    );
  }

  async updateTag(tagId: string, newData: unknown) {
    return this.db.one(
      `
    UPDATE "tag"
    SET ${Object.keys(newData)
        .filter(key => newData[key] !== undefined)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')}
    WHERE tag_id = $${Object.keys(newData).length + 1}
    RETURNING *;
    `,
      [...Object.values(newData).filter(value => value !== undefined), tagId],
    );
  }

  async deleteTagById(tagId: string) {
    return this.db.none(
      'DELETE FROM public."tag" WHERE tag_id = $1',
      [tagId],
    );
  }

  async getId() {
    return this.db.oneOrNone('SELECT MAX(tag_id) FROM public."tag"');
  }


}