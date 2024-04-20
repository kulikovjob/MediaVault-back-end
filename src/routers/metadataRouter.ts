import { Router } from 'express';

import {
  getAllMetadata,
  getAllMetadataById,
  addNewMetadata,
  updateMetadata,
  deleteMetadataById,
} from '../controllers/metadataController';
import { connectToModel } from '../controllers/mediaController';
import { MetadataModel } from '../models/metadataModel';

const router = Router();

router.use(connectToModel(MetadataModel));

router.route('/metadata/').get(getAllMetadata).post(addNewMetadata);

router
  .route('/metadata/:metadataId')
  .get(getAllMetadataById)
  .patch(updateMetadata)
  .delete(deleteMetadataById);
export default router;
