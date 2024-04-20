import { Router } from 'express';

import {
  getAllComments,
  getCommentById,
  addNewComment,
  updateComment,
  deleteCommentById,
} from '../controllers/commentController';
import { connectToModel } from '../controllers/mediaController';
import { CommentModel } from '../models/commentModel';

const router = Router();

router.use(connectToModel(CommentModel));

router.route('/comments/').get(getAllComments).post(addNewComment);

router
  .route('/comments/:commentId')
  .get(getCommentById)
  .patch(updateComment)
  .delete(deleteCommentById);
export default router;
