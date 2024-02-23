/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { File as ImageType } from '../types/types';
import { ImageModel } from '../models/imageModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const Image = new ImageModel();

interface RequestParams {
  fileId: string;
}

export const getAllImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const images = await Image.getAllImages();

    res
      .status(200)
      .json({ status: 'success', length: images.length, data: { images } });
  },
);

export const getImageById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const image = await Image.getSingleImage(req.params.fileId);

    if (!image) {
      return next(new AppError('Image not found or file type is not 1', 404));
    }

    res.status(200).json({ status: 'success', data: { image } });
  },
);

export const addImage = catchAsync(
  async (
    req: Request<object, object, Partial<ImageType>>,
    res: Response,
    next: NextFunction,
  ) => {
    const maxFileId = await Image.getId();
    const newFileId = maxFileId ? maxFileId.max + 1 : 1;
    const newImage = await Image.addNewImage({ id: newFileId, ...req.body });
    res.status(201).json({ status: 'success', data: { newImage } });
  },
);

export const deleteImageById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    await Image.deleteImageById(req.params.fileId);

    res
      .status(200)
      .json({ status: 'success', message: 'Image deleted successfully' });
  },
);

export const updateImageById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { fileId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    const image = await Image.getSingleImage(req.params.fileId);

    if (!image) {
      return next(new AppError('Image not found or file type is not 1', 404));
    }

    const updatedImage = await Image.updateImageById(fileId, newData);

    res.status(200).json({ status: 'success', data: { image: updatedImage } });
  }
);