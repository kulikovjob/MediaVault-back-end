/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import pg from 'pg-promise';

const pgp = pg({});
const url = 'postgres://postgres:Zereso23@localhost:5431/MediaVault';
const db = pgp(url);

export const getAllAudios = async (req: Request, res: Response) => {
  const audios = await db.manyOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 3;',
  );

  res
    .status(200)
    .json({ status: 'success', length: audios.length, data: { audios } });
};

export const getAudioById = async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.fileId); // Получаем file_id из параметра запроса
  const audio = await db.oneOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 3 AND file_id = $1;',
    fileId // Передаем file_id как параметр запроса
  );

  if (audio) {
    res.status(200).json({ status: 'success', data: { audio } });
  } else {
    res.status(404).json({ status: 'error', message: 'Audio not found or file type is not 3' });
  }
};

