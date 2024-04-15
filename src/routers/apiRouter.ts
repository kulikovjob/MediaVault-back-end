import { Router } from 'express';
import {
  commentRouter,
  fileTypeRouter,
  genreRouter,
  mediaRouter,
  metadataRouter,
  superMetadataRouter,
  tagRouter,
  userRouter,
  viewRouter,
} from '.';

const router = Router();

router.use('/media', mediaRouter);
router.use('/genre', genreRouter);
router.use('/tag', tagRouter);
router.use('/file', fileTypeRouter);
router.use('/user', userRouter);
router.use('/view', viewRouter);
router.use('/comment', commentRouter);
router.use('/metadata', metadataRouter);
router.use('/metadata/super', superMetadataRouter);

export default router;
