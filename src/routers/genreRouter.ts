import { Router } from 'express';

import {
  getAllGenres,
  getGenreById,
  addNewGenre,
  updateGenre,
  deleteGenreById,
} from '../controllers/genreController';
import { connectToModel } from '../controllers/mediaController';
import { GenreModel } from '../models/genreModel';

const router = Router();

router.use(connectToModel(GenreModel));

router.route('/genres/').get(getAllGenres).post(addNewGenre);

router
  .route('/genres/:genreId')
  .get(getGenreById)
  .patch(updateGenre)
  .delete(deleteGenreById);
export default router;
