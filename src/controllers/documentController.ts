/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import pg from 'pg-promise';

const pgp = pg({});
const url = 'postgres://postgres:Zereso23@localhost:5431/MediaVault';
const db = pgp(url);

export const getAllDocuments = async (req: Request, res: Response) => {
  const documents = await db.manyOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 4;',
  );

  res
    .status(200)
    .json({ status: 'success', length: documents.length, data: { documents } });
};

export const getDocumentById = async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.fileId); // Получаем file_id из параметра запроса
  const document = await db.oneOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 4 AND file_id = $1;',
    fileId // Передаем file_id как параметр запроса
  );

  if (document) {
    res.status(200).json({ status: 'success', data: { document } });
  } else {
    res.status(404).json({ status: 'error', message: 'Document not found or file type is not 4' });
  }
};

