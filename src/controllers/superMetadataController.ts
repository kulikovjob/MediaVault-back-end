import { NextFunction, Request, Response } from 'express';
import { SuperMetadata } from '../types/types';
import { SuperMetadataModel } from '../models/superMetadataModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const SuperMetadata = new SuperMetadataModel();

interface RequestParams {
  superMetadataId: string
}

export const getAllSuperMetadata = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const superMetadata = await SuperMetadata.getAllSuperMetadata();

    res
      .status(200)
      .json({ status: 'success', length: superMetadata.length, data: { superMetadata } });
  },
);

export const getSuperMetadataById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { superMetadataId } = req.params; // Получаем тип файла из параметров маршрута
    const superMetadata = await SuperMetadata.getSuperMetadataById(superMetadataId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: superMetadata.length, data: { superMetadata } });
  },
);

export const addNewSuperMetadata = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const newSuperMetadata = await SuperMetadata.addNewSuperMetadata({ ...req.body });
    res.status(201).json({ status: 'success', data: { newSuperMetadata } });
  },
);

export const updateSuperMetadata = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { superMetadataId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await SuperMetadata.updateSuperMetadata(superMetadataId, newData);

    res.status(200).json({ status: 'success', message: 'SuperMetadata updated successfully' });
  },
);

export const deleteSuperMetadataById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { superMetadataId } = req.params;
    await SuperMetadata.deleteSuperMetadataById(superMetadataId);

    res
      .status(200)
      .json({ status: 'success', message: 'SuperMetadata deleted successfully' });
  },
);