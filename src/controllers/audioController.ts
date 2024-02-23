/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { File as AudioType } from '../types/types';
import { AudioModel } from '../models/audioModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const Audio = new AudioModel();

interface RequestParams {
  fileId: string;
}

export const getAllAudios = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const audios = await Audio.getAllAudios();

    res
      .status(200)
      .json({ status: 'success', length: audios.length, data: { audios } });
  },
);

export const getAudioById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const audio = await Audio.getSingleAudio(req.params.fileId);

    if (!audio) {
      return next(new AppError('Audio not found or file type is not 3', 404));
    }

    res.status(200).json({ status: 'success', data: { audio } });
  },
);

export const addAudio = catchAsync(
  async (
    req: Request<object, object, Partial<AudioType>>,
    res: Response,
    next: NextFunction,
  ) => {
    const maxFileId = await Audio.getId();
    const newFileId = maxFileId ? maxFileId.max + 1 : 1;
    const newAudio = await Audio.addNewAudio({ id: newFileId, ...req.body });
    res.status(201).json({ status: 'success', data: { newAudio } });
  },
);

export const deleteAudioById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    await Audio.deleteAudioById(req.params.fileId);

    res
      .status(200)
      .json({ status: 'success', message: 'Audio deleted successfully' });
  },
);

export const updateAudioById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { fileId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    const audio = await Audio.getSingleAudio(req.params.fileId);

    if (!audio) {
      return next(new AppError('Audio not found or file type is not 3', 404));
    }

    const updatedAudio = await Audio.updateAudioById(fileId, newData);

    res.status(200).json({ status: 'success', data: { audio: updatedAudio } });
  }
);