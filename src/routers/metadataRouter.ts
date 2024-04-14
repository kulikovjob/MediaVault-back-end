import { Router } from 'express';

const router = Router();

import {
  getAllMetadata,
  getAllMetadataById,
  addNewMetadata,
  updateMetadata,
  deleteMetadataById
} from '../controllers/metadataController';

router.route('/metadata/')
  .get(getAllMetadata)
  .post(addNewMetadata)

router.route('/metadata/:metadataId')
  .get(getAllMetadataById)
  .patch(updateMetadata)
  .delete(deleteMetadataById)
export default router;