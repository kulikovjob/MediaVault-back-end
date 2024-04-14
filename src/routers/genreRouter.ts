import { Router } from 'express'

import {
  getAllGenres,
  getGenreById,
  addNewGenre,
  updateGenre,
  deleteGenreById
} from '../controllers/genreController';

const router = Router();

router.route('/genres/')
  .get(getAllGenres)
  .post(addNewGenre)

router.route('/genres/:genreId')
  .get(getGenreById)
  .patch(updateGenre)
  .delete(deleteGenreById)
export default router;