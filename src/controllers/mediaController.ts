/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import jwtParser, { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { RequestWithAuth } from '../utils/databaseUtils';
import { AppError } from '../utils/appError';

export const checkCookie = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.jwt) {
    next(new AppError('You need to log in first!', 401));
  }
};

export const connectToModel =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Model: any) => (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { jwt } = req.cookies;
    const parsedJwt = jwtParser.decode(jwt, { complete: true });

    const { password, host, name, port, username } =
      parsedJwt.payload as JwtPayload;
    req.model = new Model(password, host, name, port, username);
    next();
  };

export const getAllMediaFilesInfo = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const media = await req.model.getAllMediaFilesInfo();

    res
      .status(200)
      .json({ status: 'success', length: media.length, data: { media } });
  },
);
export const getAllMediaFiles = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    const media = await req.model.getAllMediaFiles(filetypeId);

    res
      .status(200)
      .json({ status: 'success', length: media.length, data: { media } });
  },
);

export const getMediaFileById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId, fileId } = req.params;
    const mediaFile = await req.model.getMediaFileById(filetypeId, fileId);

    if (!mediaFile) {
      return res
        .status(404)
        .json({ status: 'error', message: 'req.model file not found' });
    }

    res.status(200).json({ status: 'success', data: mediaFile });
  },
);

export const addNewFile = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId } = req.params;
    const newFile = await req.model.addNewFile({
      ...req.body,
      file_type_id: filetypeId,
    });
    res.status(201).json({ status: 'success', data: { newFile } });
  },
);

export const deleteFileById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId, fileId } = req.params;
    await req.model.deleteFileById(filetypeId, fileId);

    res
      .status(200)
      .json({ status: 'success', message: 'File deleted successfully' });
  },
);

export const updateFile = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { filetypeId, fileId } = req.params;
    const newData = req.body;
    // Проверка наличия данных для обновления
    if (!Object.keys(newData).length) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No data provided for update' });
    }

    // Обновление файла в базе данных
    await req.model.updateFile(filetypeId, fileId, newData);

    res
      .status(200)
      .json({ status: 'success', message: 'File updated successfully' });
  },
);
