//import pgPromise, { IDatabase } from 'pg-promise';
//import { IClient } from 'pg-promise/typescript/pg-subset';
import dotenv from 'dotenv';
import { File } from '../types/types';
import { getDatabaseInstance } from '../utils/databaseUtils';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class MediaModel {
  db;

  constructor(
    username: string,
    name: string,
    password: string,
    port: string,
    host: string,
  ) {
    this.db = getDatabaseInstance({ name, password, host, port, username });
  }

  async getAllMediaFilesInfo() {
    return this.db.manyOrNone(
      `
        SELECT * FROM get_multimedia_files_info();
      `,
    );
  }
  async getAllMediaFiles(fileTypeId: string) {
    return this.db.manyOrNone(
      `
        SELECT
        mf.file_id,
        mf.file_name,
        mf.upload_date,
        u.first_name,
        u.second_name,
        ft.type_name AS file_type_name
        FROM
        MultimediaFile mf
        JOIN
        FileType ft ON mf.file_type_id = ft.file_type_id
        LEFT JOIN
        "User" u ON mf.uploader_id = u.user_id
        WHERE
        mf.file_type_id = $1
      `,
      [fileTypeId],
    );
  }

  async getMediaFileById(fileTypeId: string, fileId: string) {
    const mediaFile = await this.db.oneOrNone(
      `
        SELECT
        mf.file_id,
        mf.file_name,
        mf.upload_date,
        u.first_name,
        u.second_name,
        ft.type_name AS file_type_name
        FROM
        MultimediaFile mf
        JOIN
        FileType ft ON mf.file_type_id = ft.file_type_id
        LEFT JOIN
        "User" u ON mf.uploader_id = u.user_id
        WHERE
        mf.file_type_id = $1 AND
        mf.file_id = $2
      `,
      [fileTypeId, fileId],
    );

    // Вызываем функцию для заполнения таблицы View
    await this.fillViewTable(mediaFile.file_id);

    return mediaFile;
  }

  async fillViewTable(fileId: string): Promise<void> {
    await this.db.oneOrNone('SELECT fill_view_table($1)', fileId);
  }

  async addNewFile(data: Partial<File>) {
    return this.db.one('SELECT add_new_file($1, $2, $3) AS file_id', [
      ...Object.values(data),
    ]);
  }

  async deleteFileById(filetypeId: string, fileId: string) {
    return this.db.none(
      'DELETE FROM public.multimediafile WHERE file_id = $1 AND file_type_id = $2',
      [fileId, filetypeId],
    );
  }

  async updateFile(filetypeId: string, fileId: string, newData: any) {
    return this.db.one(
      `
        UPDATE public.multimediafile
        SET
          ${Object.keys(newData)
            .filter((key) => newData[key] !== undefined)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ')}
        WHERE file_id = $${Object.keys(newData).length + 1}
        AND file_type_id = $${Object.keys(newData).length + 2}
        RETURNING *;
      `,
      [
        ...Object.values(newData).filter((value) => value !== undefined),
        fileId,
        filetypeId,
      ],
    );
  }

  async getId() {
    return this.db.oneOrNone('SELECT MAX(file_id) FROM public.multimediafile');
  }
}
