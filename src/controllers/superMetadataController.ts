import { NextFunction, Request, Response } from 'express';
import { SuperMetadata } from '../types/types';
import { SuperMetadataModel } from '../models/superMetadataModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { RequestWithAuth } from '../utils/databaseUtils';


export const getAllSuperMetadata = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const superMetadata = await req.model.getAllSuperMetadata();

    res
      .status(200)
      .json({ status: 'success', length: superMetadata.length, data: { superMetadata } });
  },
);

export const getSuperMetadataById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { superMetadataId } = req.params; // Получаем тип файла из параметров маршрута
    const superMetadata = await req.model.getSuperMetadataById(superMetadataId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: superMetadata.length, data: { superMetadata } });
  },
);

export const addNewSuperMetadata = catchAsync(
  async (
    req: RequestWithAuth,
    res: Response,
    next: NextFunction,
  ) => {
    const newSuperMetadata = await req.model.addNewSuperMetadata({ ...req.body });
    res.status(201).json({ status: 'success', data: { newSuperMetadata } });
  },
);

export const updateSuperMetadata = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { superMetadataId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await req.model.updateSuperMetadata(superMetadataId, newData);

    res.status(200).json({ status: 'success', message: 'SuperMetadata updated successfully' });
  },
);

export const deleteSuperMetadataById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { superMetadataId } = req.params;
    await req.model.deleteSuperMetadataById(superMetadataId);

    res
      .status(200)
      .json({ status: 'success', message: 'SuperMetadata deleted successfully' });
  },
);