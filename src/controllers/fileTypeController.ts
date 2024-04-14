import { NextFunction, Request, Response } from 'express';
import { FileType } from '../types/types';
import { FileTypeModel } from '../models/fileTypeModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const FileType = new FileTypeModel();

interface RequestParams {
  filetypeId: string
}

export const getAllFileTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileTypes = await FileType.getAllFileTypes();

    res
      .status(200)
      .json({ status: 'success', length: fileTypes.length, data: { fileTypes } });
  },
);

export const getFileTypeById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params; // Получаем тип файла из параметров маршрута
    const filetype = await FileType.getFileTypeById(filetypeId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: filetype.length, data: { filetype } });
  },
);

export const addNewFileType = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const newFileType = await FileType.addNewFileType({ ...req.body });
    res.status(201).json({ status: 'success', data: { newFileType } });
  },
);

export const updateFileType = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await FileType.updateFileType(filetypeId, newData);

    res.status(200).json({ status: 'success', message: 'FileType updated successfully' });
  },
);

export const deleteFileTypeById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    await FileType.deleteFileTypeById(filetypeId);

    res
      .status(200)
      .json({ status: 'success', message: 'FileType deleted successfully' });
  },
);