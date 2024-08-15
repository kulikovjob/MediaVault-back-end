import { NextFunction, Request, Response } from 'express';
import { View  } from '../types/types';
import { ViewModel } from '../models/viewModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const View = new ViewModel();

interface RequestParams {
  fileId: string;
  filetypeId: string;
}

export const getViewsByFileId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { filetypeId,  fileId } = req.params;
  const mediaFile = await View.getViewsByFileId(filetypeId, fileId);

  if (!mediaFile) {
    return res.status(404).json({ status: 'error', message: 'Media file not found' });
  }

  res.status(200).json({ status: 'success', data: mediaFile });
});

export const getViewsByPeriod = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка, что конечная дата не раньше начальной
    if (endDate < startDate) {
      return res.status(400).json({ status: 'error', message: 'End date cannot be earlier than start date' });
    }

    const views = await View.getViewsByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getPopularFilesByPeriod = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка, что конечная дата не раньше начальной
    if (endDate < startDate) {
      return res.status(400).json({ status: 'error', message: 'End date cannot be earlier than start date' });
    }
    const views = await View.getPopularFilesByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getPopularGenresByPeriod = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка, что конечная дата не раньше начальной
    if (endDate < startDate) {
      return res.status(400).json({ status: 'error', message: 'End date cannot be earlier than start date' });
    }

    const views = await View.getPopularGenresByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getPopularTagsByPeriod = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка, что конечная дата не раньше начальной
    if (endDate < startDate) {
      return res.status(400).json({ status: 'error', message: 'End date cannot be earlier than start date' });
    }

    const views = await View.getPopularTagsByPeriod(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getAuthorsByPopularity = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.body;

    // Проверка наличия данных для запроса
    if (!start_date || !end_date) {
      return res.status(400).json({ status: 'error', message: 'Start date and end date are required' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка, что конечная дата не раньше начальной
    if (endDate < startDate) {
      return res.status(400).json({ status: 'error', message: 'End date cannot be earlier than start date' });
    }

    const views = await View.getAuthorsByPopularity(new Date(start_date), new Date(end_date));

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getSortedFilesByViews = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {

    const { start_date, end_date } = req.body;


    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Проверка, что конечная дата не раньше начальной
    if (endDate < startDate) {
      return res.status(400).json({ status: 'error', message: 'End date cannot be earlier than start date' });
    }

    const views = await View.getSortedFilesByViews({...req.body} );

    res.status(200).json({ status: 'success', data: views });
  },
);

export const getAllFilesSortedByComments = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {

    const views = await View.getAllFilesSortedByComments();

    res.status(200).json({ status: 'success', data: views });
  },
);