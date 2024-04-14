import { Router } from 'express';

const router = Router();

import {
  getAllSuperMetadata,
  getSuperMetadataById,
  addNewSuperMetadata,
  updateSuperMetadata,
  deleteSuperMetadataById
} from '../controllers/superMetadataController';

router.route('/supermetadata/')
  .get(getAllSuperMetadata)
  .post(addNewSuperMetadata)

router.route('/supermetadata/:superMetadataId')
  .get(getSuperMetadataById)
  .patch(updateSuperMetadata)
  .delete(deleteSuperMetadataById)
export default router;