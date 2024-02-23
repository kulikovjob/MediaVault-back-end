import dotenv from 'dotenv';
import { MediaTypes, File } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class DocumentModel {
  db = getDatabaseInstance()

  async getAllDocuments() {
    return this.db.manyOrNone(
      `SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = ${MediaTypes.Document};`,
    );
  }

  async getSingleDocument(id: string) {
    return this.db.oneOrNone(
      `SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = ${MediaTypes.Document} AND file_id = $1;`,
      parseInt(id, 10),
    );
  }

  async addNewDocument(data: Partial<File>) {
    return this.db.one(
      'INSERT INTO public.multimediafile (file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING file_id;',
      [...Object.values(data)],
    );
  }

  async deleteDocumentById(id: string) {
    return this.db.none(
      'DELETE FROM public.multimediafile WHERE file_id = $1',
      [id],
    );
  }

  async updateDocumentById(fileId: string, newData: Partial<File>) {
    return this.db.one(
      `
        UPDATE public.multimediafile
        SET
          metadata = COALESCE(metadata, '{}'::jsonb) || $/metadata/
          ${Object.keys(newData)
        .filter(key => key !== 'metadata')
        .map(key => `${key} = $/${key}/`)
        .join(', ')}
        WHERE file_id = $/fileId/
        RETURNING *;
      `,
      { fileId, ...newData }
    );
  }
  async getId() {
    return this.db.oneOrNone('SELECT MAX(file_id) FROM public.multimediafile');
  }
}
