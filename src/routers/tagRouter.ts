import { Router } from 'express'

const router = Router();

import {
  getAllTags,
  getTagById,
  addNewTag,
  updateTag,
  deleteTagById
} from '../controllers/tagController';

router.route('/tags/')
  .get(getAllTags)
  .post(addNewTag)

router.route('/tags/:tagId')
  .get(getTagById)
  .patch(updateTag)
  .delete(deleteTagById)
export default router;