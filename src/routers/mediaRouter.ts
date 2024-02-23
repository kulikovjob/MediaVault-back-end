import { Router } from 'express';
import {
  getAllVideos,
  getVideoById,
  addVideo,
  deleteVideoById,
  updateVideoById
} from '../controllers/videoController';
import {
  getAllAudios,
  getAudioById,
  addAudio,
  deleteAudioById,
  updateAudioById
} from '../controllers/audioController';
import {
  getAllImages,
  getImageById,
  addImage,
  deleteImageById,
  updateImageById
} from '../controllers/imageController';
import {
  getAllDocuments,
  getDocumentById,
  addDocument,
  deleteDocumentById,
  updateDocumentById
} from '../controllers/documentController';

const router = Router();

// Video
router.route('/video/')
  .get(getAllVideos)
  .post(addVideo);

router.route('/video/:fileId')
  .get(getVideoById)
  .patch(updateVideoById)
  .delete(deleteVideoById);

// Audio
router.route('/audio/')
  .get(getAllAudios)
  .post(addAudio);

router.route('/audio/:fileId')
  .get(getAudioById)
  .patch(updateAudioById)
  .delete(deleteAudioById);

// Image
router.route('/image/')
  .get(getAllImages)
  .post(addImage);

router.route('/image/:fileId')
  .get(getImageById)
  .patch(updateImageById)
  .delete(deleteImageById);

// Document
router.route('/document/')
  .get(getAllDocuments)
  .post(addDocument);

router
  .route('/document/:fileId')
  .get(getDocumentById)
  .patch(updateDocumentById)
  .delete(deleteDocumentById);

export default router;
