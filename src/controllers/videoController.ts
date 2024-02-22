/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { Video as VideoType } from '../types/types';
import { VideoModel } from '../models/videoModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const Video = new VideoModel();

export const getAllVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const videos = await Video.getAllVideos();

    res
      .status(200)
      .json({ status: 'success', length: videos.length, data: { videos } });
  },
);

interface RequestParams {
  fileId: string;
}

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
    const newVideo = await Video.addNewVideo({ ...req.body, id: newFileId });
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
