/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import pg from 'pg-promise';

const pgp = pg({});
const url = 'postgres://postgres:Zereso23@localhost:5431/MediaVault';
const db = pgp(url);

export const getAllImages = async (req: Request, res: Response) => {
  const images = await db.manyOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 1;',
  );

  res
    .status(200)
    .json({ status: 'success', length: images.length, data: { images } });
};

export const getImageById = async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.fileId); // Получаем file_id из параметра запроса
  const image = await db.oneOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 1 AND file_id = $1;',
    fileId // Передаем file_id как параметр запроса
  );

  if (image) {
    res.status(200).json({ status: 'success', data: { image } });
  } else {
    res.status(404).json({ status: 'error', message: 'Image not found or file type is not 1' });
  }
};

