/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import pg from 'pg-promise';

const pgp = pg({});
const url = 'postgres://postgres:Zereso23@localhost:5431/MediaVault';
const db = pgp(url);

export const getAllVideos = async (req: Request, res: Response) => {
  const videos = await db.manyOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 2;',
  );

  res
    .status(200)
    .json({ status: 'success', length: videos.length, data: { videos } });
};

export const getVideoById = async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.fileId); // Получаем file_id из параметра запроса
  const video = await db.oneOrNone(
    'SELECT file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible FROM public.multimediafile WHERE file_type_id = 2 AND file_id = $1;',
    fileId // Передаем file_id как параметр запроса
  );

  if (video) {
    res.status(200).json({ status: 'success', data: { video } });
  } else {
    res.status(404).json({ status: 'error', message: 'Video not found or file type is not 2' });
  }
};

export const addVideo = async (req: Request, res: Response) => {
  try {
    const { file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible } = req.body;

    // Получаем максимальное значение file_id из базы данных
    const maxFileId = await db.oneOrNone('SELECT MAX(file_id) FROM public.multimediafile');
    let newFileId = maxFileId ? maxFileId.max + 1 : 1; // Увеличиваем его на единицу для нового file_id

    const newVideo = await db.one(
      'INSERT INTO public.multimediafile (file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING file_id;',
      [newFileId, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible]
    );
    res.status(201).json({ status: 'success', data: { newVideo } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: `Failed to add video with file_id: ${req.body.file_id || 'undefined'}`, error: error.message });
  }
};

export const deleteVideoById = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId); // Получаем file_id из параметра запроса

    // Проверяем, существует ли видео с указанным file_id
    const existingVideo = await db.oneOrNone('SELECT * FROM public.multimediafile WHERE file_id = $1', [fileId]);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    // Удаляем видео из базы данных
    await db.none('DELETE FROM public.multimediafile WHERE file_id = $1', [fileId]);

    res.status(200).json({ status: 'success', message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete video', error: error.message });
  }
};



