import pgPromise, { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';
import { MediaTypes, File } from '../types/types';
import { getDatabaseConnectionUrl } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class ImageModel {
  db: IDatabase<object, IClient>;

  constructor() {
    const url = getDatabaseConnectionUrl();
    this.db = pgPromise()(url);
  }

  async getAllImages() {
    return this.db.manyOrNone(
      `SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = ${MediaTypes.Image};`,
    );
  }

  async getSingleImage(id: string) {
    return this.db.oneOrNone(
      `SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = ${MediaTypes.Image} AND file_id = $1;`,
      parseInt(id, 10),
    );
  }

  async addNewImage(data: Partial<File>) {
    return this.db.one(
      'INSERT INTO public.multimediafile (file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING file_id;',
      [...Object.values(data)],
    );
  }

  async deleteImageById(id: string) {
    return this.db.none(
      'DELETE FROM public.multimediafile WHERE file_id = $1',
      [id],
    );
  }

  async getId() {
    return this.db.oneOrNone('SELECT MAX(file_id) FROM public.multimediafile');
  }
}
