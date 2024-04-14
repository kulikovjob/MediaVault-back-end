import { Request, Response } from 'express';
import { CommentModel } from '../models/commentModel';
import { catchAsync } from '../utils/catchAsync';
//import { AppError } from '../utils/appError';

const Comment = new CommentModel();

interface RequestParams {
  commentId: string
}

export const getAllComments = catchAsync(
  async (req: Request, res: Response) => {
    const comments = await Comment.getAllComments();

    res
      .status(200)
      .json({ status: 'success', length: comments.length, data: { comments } });
  },
);

export const getCommentById = catchAsync(
  async (req: Request, res: Response) => {
    const { commentId } = req.params; // Получаем тип файла из параметров маршрута
    const comment = await Comment.getCommentById(commentId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: comment.length, data: { comment } });
  },
);

export const addNewComment = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const newComment = await Comment.addNewComment({ ...req.body });
    res.status(201).json({ status: 'success', data: { newComment } });
  },
);

export const updateComment = catchAsync(
  async (req: Request<RequestParams>, res: Response) => {
    const { commentId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await Comment.updateComment(commentId, newData);

    res.status(200).json({ status: 'success', message: 'Comment updated successfully' });
  },
);

export const deleteCommentById = catchAsync(
  async (req: Request<RequestParams>, res: Response) => {
    const { commentId } = req.params;
    await Comment.deleteCommentById(commentId);

    res
      .status(200)
      .json({ status: 'success', message: 'Comment deleted successfully' });
  },
);