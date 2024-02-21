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

export const addDocument = async (req: Request, res: Response) => {
  try {
    const { file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible } = req.body;

    // Получаем максимальное значение file_id из базы данных
    const maxFileId = await db.oneOrNone('SELECT MAX(file_id) FROM public.multimediafile');
    let newFileId = maxFileId ? maxFileId.max + 1 : 1; // Увеличиваем его на единицу для нового file_id

    const newDocument = await db.one(
      'INSERT INTO public.multimediafile (file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING file_id;',
      [newFileId, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible]
    );
    res.status(201).json({ status: 'success', data: { newDocument } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: `Failed to add document with file_id: ${req.body.file_id || 'undefined'}`, error: error.message });
  }
};

export const deleteDocumentById = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId); // Получаем file_id из параметра запроса

    // Проверяем, существует ли document с указанным file_id
    const existingDocument = await db.oneOrNone('SELECT * FROM public.multimediafile WHERE file_id = $1', [fileId]);
    if (!existingDocument) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    // Удаляем document из базы данных
    await db.none('DELETE FROM public.multimediafile WHERE file_id = $1', [fileId]);

    res.status(200).json({ status: 'success', message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete Document', error: error.message });
  }
};