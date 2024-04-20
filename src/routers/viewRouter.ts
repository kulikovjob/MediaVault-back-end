import { Router } from 'express';

import {
  getViewsByFileId,
  getViewsByPeriod,
  getPopularFilesByPeriod,
  getPopularGenresByPeriod,
  getPopularTagsByPeriod,
  getAuthorsByPopularity,
  getSortedFilesByViews,
} from '../controllers/viewController';
import { connectToModel } from '../controllers/mediaController';
import { ViewModel } from '../models/viewModel';

const router = Router();

router.use(connectToModel(ViewModel));

router.route('/views/:filetypeId/:fileId').get(getViewsByFileId);

router.route('/views/').post(getViewsByPeriod);

router.route('/views/authors/').post(getAuthorsByPopularity);

router.route('/files/').post(getPopularFilesByPeriod);

router.route('/genres/').post(getPopularGenresByPeriod);

router.route('/tags/').post(getPopularTagsByPeriod);

router.route('/files/sorted/').post(getSortedFilesByViews);

export default router;
