/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { File  } from '../types/types';
import { MediaModel } from '../models/mediaModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const Media = new MediaModel()

interface RequestParams {
  fileId: string;
  filetypeId: string;
}

export const getAllMediaFilesInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const media = await Media.getAllMediaFilesInfo();

    res
      .status(200)
      .json({ status: 'success', length: media.length, data: { media } });
  },
);
export const getAllMediaFiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    const media = await Media.getAllMediaFiles(filetypeId);

    res
      .status(200)
      .json({ status: 'success', length: media.length, data: { media } });
  },
);

export const getMediaFileById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { filetypeId, fileId } = req.params;
  const mediaFile = await Media.getMediaFileById(filetypeId, fileId);

  if (!mediaFile) {
    return res.status(404).json({ status: 'error', message: 'Media file not found' });
  }

  res.status(200).json({ status: 'success', data: mediaFile });
});

export const addNewFile = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { filetypeId } = req.params
    const newFile = await Media.addNewFile({ ...req.body, file_type_id: filetypeId });
    res.status(201).json({ status: 'success', data: { newFile } });
  },
);

export const deleteFileById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { filetypeId, fileId } = req.params;
    await Media.deleteFileById(filetypeId, fileId);

    res
      .status(200)
      .json({ status: 'success', message: 'File deleted successfully' });
  },
);

export const updateFile = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { filetypeId, fileId } = req.params;
    const newData = req.body;
    // Проверка наличия данных для обновления
    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    // Обновление файла в базе данных
    await Media.updateFile(filetypeId, fileId, newData);

    res.status(200).json({ status: 'success', message: 'File updated successfully' });
  },
);










