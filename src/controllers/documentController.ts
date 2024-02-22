/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { File as DocumentType } from '../types/types';
import { DocumentModel } from '../models/documentModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const Document = new DocumentModel();

interface RequestParams {
  fileId: string;
}
export const getAllDocuments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const documents = await Document.getAllDocuments();

    res
      .status(200)
      .json({ status: 'success', length: documents.length, data: { documents } });
  },
);

export const getDocumentById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const document = await Document.getSingleDocument(req.params.fileId);

    if (!document) {
      return next(new AppError('Document not found or file type is not 4', 404));
    }

    res.status(200).json({ status: 'success', data: { document } });
  },
);

export const addDocument = catchAsync(
  async (
    req: Request<object, object, Partial<DocumentType>>,
    res: Response,
    next: NextFunction,
  ) => {
    const maxFileId = await Document.getId();
    const newFileId = maxFileId ? maxFileId.max + 1 : 1;
    const newDocument = await Document.addNewDocument({ id: newFileId, ...req.body });
    res.status(201).json({ status: 'success', data: { newDocument } });
  },
);

export const deleteDocumentById = catchAsync(
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    await Document.deleteDocumentById(req.params.fileId);

    res
      .status(200)
      .json({ status: 'success', message: 'Document deleted successfully' });
  },
);
