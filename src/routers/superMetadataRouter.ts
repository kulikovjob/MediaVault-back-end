import { Router } from 'express';

import {
  getAllSuperMetadata,
  getSuperMetadataById,
  addNewSuperMetadata,
  updateSuperMetadata,
  deleteSuperMetadataById,
} from '../controllers/superMetadataController';
import { connectToModel } from '../controllers/mediaController';
import { SuperMetadataModel } from '../models/superMetadataModel';

const router = Router();

router.use(connectToModel(SuperMetadataModel));

router
  .route('/supermetadata/')
  .get(getAllSuperMetadata)
  .post(addNewSuperMetadata);

router
  .route('/supermetadata/:superMetadataId')
  .get(getSuperMetadataById)
  .patch(updateSuperMetadata)
  .delete(deleteSuperMetadataById);
export default router;
