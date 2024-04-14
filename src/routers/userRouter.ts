import { Router } from 'express';

const router = Router();

import {
  getAllUsers,
  getUserForCurrentUser,
  getUserById,
  deleteUserById
} from '../controllers/userController';

router.route('/user/').get(getUserForCurrentUser)
router.route('/users/')
  .get(getAllUsers)

router.route('/users/:userId')
  .get(getUserById)
  .delete(deleteUserById)
export default router