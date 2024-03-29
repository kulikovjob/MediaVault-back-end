/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { File as VideoType } from '../types/types';
import { VideoModel } from '../models/videoModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const Video = new VideoModel();

interface RequestParams {
  fileId: string;
}

export const getAllVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const videos = await Video.getAllVideos();

    res
      .status(200)
      .json({ status: 'success', length: videos.length, data: { videos } });
  },
);

export const getVideoById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const video = await Video.getSingleVideo(req.params.fileId);

    if (!video) {
      return next(new AppError('Video not found or file type is not 2', 404));
    }

    res.status(200).json({ status: 'success', data: { video } });
  },
);

export const addVideo = catchAsync(
  async (
    req: Request<object, object, Partial<VideoType>>,
    res: Response,
    next: NextFunction,
  ) => {
    const maxFileId = await Video.getId();
    const newFileId = maxFileId ? maxFileId.max + 1 : 1;
    const newVideo = await Video.addNewVideo({id: newFileId, ...req.body });
    res.status(201).json({ status: 'success', data: { newVideo } });
  },
);

export const deleteVideoById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    await Video.deleteVideoById(req.params.fileId);

    res
      .status(200)
      .json({ status: 'success', message: 'Video deleted successfully' });
  },
);

export const updateVideoById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { fileId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    const video = await Video.getSingleVideo(req.params.fileId);

    if (!video) {
      return next(new AppError('Video not found or file type is not 2', 404));
    }

    const updatedVideo = await Video.updateVideoById(fileId, newData);

    res.status(200).json({ status: 'success', data: { video: updatedVideo } });
  }
);