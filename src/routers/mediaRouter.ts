import { Router } from 'express';
import { getAllVideos } from '../controllers/videoController';

const router = Router();

router.route('/video/').get(getAllVideos);

export default router;
