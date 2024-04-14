import { Router } from 'express';

const router = Router();

import {
  getAllComments,
  getCommentById,
  addNewComment,
  updateComment,
  deleteCommentById
} from '../controllers/commentController';

router.route('/comments/')
  .get(getAllComments)
  .post(addNewComment)

router.route('/comments/:commentId')
  .get(getCommentById)
  .patch(updateComment)
  .delete(deleteCommentById)
export default router;