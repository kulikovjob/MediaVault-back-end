import { Router } from 'express';

import {
  getAllFileTypes,
  getFileTypeById,
  addNewFileType,
  updateFileType,
  deleteFileTypeById,
} from '../controllers/fileTypeController';
import { connectToModel } from '../controllers/mediaController';
import { FileTypeModel } from '../models/fileTypeModel';

const router = Router();

router.use(connectToModel(FileTypeModel));

router.route('/filetype/').get(getAllFileTypes).post(addNewFileType);

router
  .route('/filetype/:filetypeId')
  .get(getFileTypeById)
  .patch(updateFileType)
  .delete(deleteFileTypeById);

export default router;
