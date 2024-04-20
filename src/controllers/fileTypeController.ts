import { NextFunction, Request, Response } from 'express';
import { FileType } from '../types/types';
import { FileTypeModel } from '../models/fileTypeModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { RequestWithAuth } from '../utils/databaseUtils';


export const getAllFileTypes = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const fileTypes = await req.model.getAllFileTypes();

    res
      .status(200)
      .json({ status: 'success', length: fileTypes.length, data: { fileTypes } });
  },
);

export const getFileTypeById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params; // Получаем тип файла из параметров маршрута
    const filetype = await req.model.getFileTypeById(filetypeId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: filetype.length, data: { filetype } });
  },
);

export const addNewFileType = catchAsync(
  async (
    req: RequestWithAuth,
    res: Response,
    next: NextFunction,
  ) => {
    const newFileType = await req.model.addNewFileType({ ...req.body });
    res.status(201).json({ status: 'success', data: { newFileType } });
  },
);

export const updateFileType = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await req.model.updateFileType(filetypeId, newData);

    res.status(200).json({ status: 'success', message: 'FileType updated successfully' });
  },
);

export const deleteFileTypeById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    await req.model.deleteFileTypeById(filetypeId);

    res
      .status(200)
      .json({ status: 'success', message: 'FileType deleted successfully' });
  },
);