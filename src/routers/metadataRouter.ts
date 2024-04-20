import { Router } from 'express';

const router = Router();

import {
  getAllMetadata,
  getAllMetadataById,
  addNewMetadata,
  updateMetadata,
  deleteMetadataById,
} from '../controllers/metadataController';
import { connectToModel } from '../controllers/mediaController';
import { MetadataModel } from '../models/metadataModel';

router.use(connectToModel(MetadataModel));

router.route('/metadata/').get(getAllMetadata).post(addNewMetadata);

router
  .route('/metadata/:metadataId')
  .get(getAllMetadataById)
  .patch(updateMetadata)
  .delete(deleteMetadataById);
export default router;
