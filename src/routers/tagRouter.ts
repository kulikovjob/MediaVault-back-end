import { Router } from 'express';

import {
  getAllTags,
  getTagById,
  addNewTag,
  updateTag,
  deleteTagById,
} from '../controllers/tagController';
import { connectToModel } from '../controllers/mediaController';
import { TagModel } from '../models/tagModel';

const router = Router();

router.use(connectToModel(TagModel));

router.route('/tags/').get(getAllTags).post(addNewTag);

router
  .route('/tags/:tagId')
  .get(getTagById)
  .patch(updateTag)
  .delete(deleteTagById);
export default router;
