import { Router } from 'express';
import { getAllVideos, getVideoById, addVideo, deleteVideoById} from '../controllers/videoController';
import { getAllAudios, getAudioById, addAudio, deleteAudioById } from '../controllers/audioController';
import { getAllImages, getImageById, addImage, deleteImageById } from '../controllers/imageController';
import { getAllDocuments, getDocumentById, addDocument, deleteDocumentById } from '../controllers/documentController';

const router = Router();

router.route('/video/').get(getAllVideos).post(addVideo);
router.route('/video/:fileId').get(getVideoById).delete(deleteVideoById);

router.route('/audio/').get(getAllAudios).post(addAudio);
router.route('/audio/:fileId').get(getAudioById).delete(deleteAudioById);

router.route('/image/').get(getAllImages).post(addImage);
router.route('/image/:fileId').get(getImageById).delete(deleteImageById);

router.route('/document/').get(getAllDocuments).post(addDocument);
router.route('/document/:fileId').get(getDocumentById).delete(deleteDocumentById);

export default router;
