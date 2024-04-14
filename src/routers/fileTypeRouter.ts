import { Router } from 'express';

import {
  getAllFileTypes,
  getFileTypeById,
  addNewFileType,
  updateFileType,
  deleteFileTypeById
} from '../controllers/fileTypeController';

const router = Router();

router.route('/filetype/')
  .get(getAllFileTypes)
  .post(addNewFileType)

router.route('/filetype/:filetypeId')
  .get(getFileTypeById)
  .patch(updateFileType)
  .delete(deleteFileTypeById)

export default router;