import { NextFunction, Response } from 'express';
import { Genre } from '../types/types';
import { GenreModel } from '../models/genreModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { RequestWithAuth } from '../utils/databaseUtils';





export const getAllGenres = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    //const { genreId } = req.params; // Получаем тип файла из параметров маршрута
    const genres = await req.model.getAllGenres(); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: genres.length, data: { genres } });
  },
);

export const getGenreById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { genreId } = req.params; // Получаем тип файла из параметров маршрута
    const genre = await req.model.getGenreById(genreId); // Используем тип файла для получения файлов определенного типа


    res
      .status(200)
      .json({ status: 'success', length: genre.length, data: { genre } });
  },
);

export const addNewGenre = catchAsync(
  async (
    req: RequestWithAuth,
    res: Response,
    next: NextFunction) => {
    const newGenre = await req.model.addNewGenre(req.body);
    res.status(201).json({ status: 'success', data: { newGenre } });
  },
);


export const updateGenre = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const {  genreId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await req.model.updateGenre(genreId, newData);

    res.status(200).json({ status: 'success', message: 'Genre updated successfully' });
  },
);

export const deleteGenreById = catchAsync(
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    const { genreId } = req.params;
    await req.model.deleteGenreById(genreId);

    res
      .status(200)
      .json({ status: 'success', message: 'Genre deleted successfully' });
  },
);