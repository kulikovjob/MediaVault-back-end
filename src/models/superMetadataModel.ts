import dotenv from 'dotenv';
import { SuperMetadata } from '../types/types';
import { BaseModel } from './baseModel';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class SuperMetadataModel extends BaseModel {

  async getAllSuperMetadata() {
    return this.db.manyOrNone(
      `
      SELECT * FROM "supermetadata"
    `);
  }

  async getSuperMetadataById(supermetadataId: string) {
    return this.db.oneOrNone(
      `
      SELECT * FROM "supermetadata"
      WHERE metadata_id = $1
    `,
      supermetadataId,
    );
  }

  async addNewSuperMetadata(data: Partial<SuperMetadata>) {
    return this.db.one(
      'INSERT INTO public."supermetadata" (metadata_name) VALUES ($1) RETURNING metadata_id;',
      [...Object.values(data)],
    );
  }

  async updateSuperMetadata(superMetadataId: string, newData: unknown) {
    return this.db.one(
      `
    UPDATE "supermetadata"
    SET ${Object.keys(newData)
        .filter(key => newData[key] !== undefined)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')}
    WHERE metadata_id = $${Object.keys(newData).length + 1}
    RETURNING *;
    `,
      [...Object.values(newData).filter(value => value !== undefined), superMetadataId]
    );
  }

  async deleteSuperMetadataById(superMetadataId: string) {
    return this.db.none(
      'DELETE FROM public."supermetadata" WHERE metadata_id = $1',
      [superMetadataId],
    );
  }

  async getId() {
    return this.db.oneOrNone('SELECT MAX(metadata_id) FROM public."supermetadata"');
  }
}