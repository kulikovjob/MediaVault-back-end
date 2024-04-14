import { Request, Response } from 'express';
import { TagModel } from '../models/tagModel';
import { catchAsync } from '../utils/catchAsync';
//import { AppError } from '../utils/appError';

const Tag = new TagModel();

interface RequestParams {
  tagId: string
}

export const getAllTags = catchAsync(
  async (req: Request, res: Response) => {
    const tags = await Tag.getAllTags();

    res
      .status(200)
      .json({ status: 'success', length: tags.length, data: { tags } });
  },
);

export const getTagById = catchAsync(
  async (req: Request, res: Response) => {
    const { tagId } = req.params; // Получаем тип файла из параметров маршрута
    const tag = await Tag.getTagById(tagId); // Используем тип файла для получения файлов определенного типа

    res
      .status(200)
      .json({ status: 'success', length: tag.length, data: { tag } });
  },
);

export const addNewTag = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const newTag = await Tag.addNewTag({ ...req.body });
    res.status(201).json({ status: 'success', data: { newTag } });
  },
);

export const updateTag = catchAsync(
  async (req: Request<RequestParams>, res: Response) => {
    const { tagId } = req.params;
    const newData = req.body;

    if (!Object.keys(newData).length) {
      return res.status(400).json({ status: 'error', message: 'No data provided for update' });
    }

    await Tag.updateTag(tagId, newData);

    res.status(200).json({ status: 'success', message: 'Tag updated successfully' });
  },
);

export const deleteTagById = catchAsync(
  async (req: Request<RequestParams>, res: Response) => {
    const { tagId } = req.params;
    await Tag.deleteTagById(tagId);

    res
      .status(200)
      .json({ status: 'success', message: 'Tag deleted successfully' });
  },
);

