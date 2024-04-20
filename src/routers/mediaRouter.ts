import { Router } from 'express';
import {
  getAllMediaFilesInfo,
  getAllMediaFiles,
  getMediaFileById,
  addNewFile,
  deleteFileById,
  updateFile,
  connectToModel,
} from '../controllers/mediaController';

const router = Router();

router.use(connectToModel);

// Media
router.route('/files/').get(getAllMediaFilesInfo);

router.route('/files/:filetypeId/').get(getAllMediaFiles).post(addNewFile);

router
  .route('/files/:filetypeId/:fileId')
  .get(getMediaFileById)
  .delete(deleteFileById)
  .patch(updateFile);

//router.route('/file/:fileId').get(getViewsByFileId)
export default router;
