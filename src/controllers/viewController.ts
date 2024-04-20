import { NextFunction, Request, Response } from 'express';
import { View  } from '../types/types';
import { ViewModel } from '../models/viewModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { RequestWithAuth } from '../utils/databaseUtils';



export const getViewsByFileId = catchAsync(async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  const { filetypeId,  fileId } = req.params;
  const mediaFile = await req.model.getViewsByFileId(filetypeId, fileId);

  if (!mediaFile) {
    return res.status(404).json({ status: 'error', message: 'Media file not found' });
  }

  res.status(200).json({ status: 'success', data: mediaFile });
});

export const getViewsByPeriod = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const views = await req.model.getViewsByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getPopularFilesByPeriod = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const views = await req.model.getPopularFilesByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getPopularGenresByPeriod = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const views = await req.model.getPopularGenresByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getPopularTagsByPeriod = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const views = await req.model.getPopularTagsByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getAuthorsByPopularity = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const views = await req.model.getAuthorsByPopularity(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getSortedFilesByViews = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {

    const views = await req.model.getSortedFilesByViews({...req.body} );

    res.status(200).json({ status: 'success', data: views });
  },
);