import dotenv from 'dotenv';
import { FileMetadata, Metadata, SuperMetadata } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

export class MetadataModel {
  db = getDatabaseInstance();

  async getAllMetadata() {
    return this.db.manyOrNone(`
    SELECT
      fm.file_metadata_id,
      fm.file_id,
      sm.metadata_name AS metadata_name,
      fm.metadata_value
    FROM
      filemetadata fm
    JOIN
      supermetadata sm ON fm.metadata_id = sm.Metadata_id;
  `);
  }

  async getAllMetadataByFileId(fileId: string) {
    return this.db.manyOrNone(`
    SELECT
      fm.file_metadata_id,
      fm.file_id,
      sm.Metadata_name AS metadata_name,
      fm.metadata_value
    FROM
      filemetadata fm
    JOIN
      Supermetadata sm ON fm.metadata_id = sm.Metadata_id
    WHERE
      fm.file_id = $1;
  `, [fileId]);
  }

  async addNewMetadata(data: Partial<FileMetadata>) {
    return this.db.one(
      'INSERT INTO public."filemetadata" (file_id, metadata_id, metadata_value) VALUES ($1, $2, $3) RETURNING file_metadata_id;',
      [...Object.values(data)],
    );
  }

  async updateMetadata(file_metadata_id: string, newData: any) {
    return this.db.one(
      `
    UPDATE "filemetadata"
    SET ${Object.keys(newData)
        .filter(key => newData[key] !== undefined)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')}
    WHERE file_metadata_id = $${Object.keys(newData).length + 1}
    RETURNING *;
    `,
      [...Object.values(newData).filter(value => value !== undefined), file_metadata_id]
    );
  }

  async deleteMetadataById(file_metadata_id: string) {
    return this.db.none(
      'DELETE FROM public."filemetadata" WHERE file_metadata_id = $1',
      [file_metadata_id]
    );
  }
}