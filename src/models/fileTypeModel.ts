import dotenv from 'dotenv';
import { FileType } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

export class FileTypeModel {
  db = getDatabaseInstance();

  async getAllFileTypes() {
    return this.db.manyOrNone(
      `
      SELECT * FROM "filetype"
    `)
  }

  async getFileTypeById(filetypeId: string) {
    return this.db.oneOrNone(
      `
      SELECT * FROM "filetype"
      WHERE file_type_id = $1
    `,
      filetypeId
    );
  }

  async addNewFileType(data: Partial<FileType>) {
    return this.db.one(
      'INSERT INTO public."filetype" (type_name) VALUES ($1) RETURNING file_type_id;',
      [...Object.values(data)],
    );
  }

  async updateFileType(filetypeId: string, newData: any) {
    return this.db.one(
      `
    UPDATE "filetype"
    SET ${Object.keys(newData)
        .filter(key => newData[key] !== undefined)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')}
    WHERE file_type_id = $${Object.keys(newData).length + 1}
    RETURNING *;
    `,
      [...Object.values(newData).filter(value => value !== undefined), filetypeId]
    );
  }

  async deleteFileTypeById(filetypeId: string) {
    return this.db.none(
      'DELETE FROM public."filetype" WHERE file_type_id = $1',
      [filetypeId],
    );
  }
}