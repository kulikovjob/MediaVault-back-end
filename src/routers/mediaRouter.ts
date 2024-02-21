import { Router } from 'express';
import { getAllVideos, getVideoById } from '../controllers/videoController';
import { getAllAudios, getAudioById } from '../controllers/audioController';
import { getAllImages, getImageById } from '../controllers/imageController';
import { getAllDocuments, getDocumentById } from '../controllers/documentController';

const router = Router();

router.route('/video/').get(getAllVideos);
router.route('/video/:fileId').get(getVideoById);

router.route('/audio/').get(getAllAudios);
router.route('/audio/:fileId').get(getAudioById);

router.route('/image/').get(getAllImages);
router.route('/image/:fileId').get(getImageById);

router.route('/document/').get(getAllDocuments);
router.route('/document/:fileId').get(getDocumentById);

export default router;
