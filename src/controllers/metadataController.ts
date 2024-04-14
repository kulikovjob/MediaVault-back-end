import { NextFunction, Request, Response } from 'express';
import { MetadataModel } from '../models/metadataModel';
import { catchAsync } from '../utils/catchAsync';
//import { AppError } from '../utils/appError';

const Metadata = new MetadataModel();

interface RequestParams {
  metadataId: string
}

export const getAllMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const metadata = await Metadata.getAllMetadata();

    res
      .status(200)
      .json({ status: 'success', length: metadata.length, data: { metadata} });
  },
);

export const getAllMetadataById = catchAsync(
  async (req: Request, res: Response) => {
    const { metadataId } = req.params; // Получаем тип файла из параметров маршрута
    const metadata = await Metadata.getAllMetadataByFileId(metadataId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: metadata.length, data: { metadata } });
  },
);

export const addNewMetadata = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const newMetadata = await Metadata.addNewMetadata({ ...req.body });
    res.status(201).json({ status: 'success', data: { newMetadata } });
  },
);

export const updateMetadata = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { metadataId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await Metadata.updateMetadata(metadataId, newData);

    res.status(200).json({ status: 'success', message: 'Metadata updated successfully' });
  },
);

export const deleteMetadataById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { metadataId } = req.params;
    await Metadata.deleteMetadataById(metadataId);

    res
      .status(200)
      .json({ status: 'success', message: 'Metadata deleted successfully' });
  },
);
