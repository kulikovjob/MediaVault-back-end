/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import pg from 'pg-promise';

const pgp = pg({});
const url = 'postgres://postgres:123kl456@localhost:5432/MediaVaultDB';
const db = pgp(url);
export const getAllVideos = async (req: Request, res: Response) => {
  const videos = await db.manyOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 2;',
  );

  res
    .status(200)
    .json({ status: 'success', length: videos.length, data: { videos } });
};
