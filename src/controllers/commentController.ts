import { Request, Response } from 'express';
import { CommentModel } from '../models/commentModel';
import { catchAsync } from '../utils/catchAsync';
import { RequestWithAuth } from '../utils/databaseUtils';
//import { AppError } from '../utils/appError';


export const getAllComments = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const comments = await req.model.getAllComments();

    res
      .status(200)
      .json({ status: 'success', length: comments.length, data: { comments } });
  },
);

export const getCommentById = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const { commentId } = req.params; // Получаем тип файла из параметров маршрута
    const comment = await req.model.getCommentById(commentId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: comment.length, data: { comment } });
  },
);

export const addNewComment = catchAsync(
  async (
    req: RequestWithAuth,
    res: Response
  ) => {
    const newComment = await req.model.addNewComment({ ...req.body });
    res.status(201).json({ status: 'success', data: { newComment } });
  },
);

export const updateComment = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const { commentId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await req.model.updateComment(commentId, newData);

    res.status(200).json({ status: 'success', message: 'Comment updated successfully' });
  },
);

export const deleteCommentById = catchAsync(
  async (req: RequestWithAuth, res: Response) => {
    const { commentId } = req.params;
    await req.model.deleteCommentById(commentId);

    res
      .status(200)
      .json({ status: 'success', message: 'Comment deleted successfully' });
  },
);