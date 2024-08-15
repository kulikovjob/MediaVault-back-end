import { Router } from 'express';

const router = Router();

import {
  getAllUsers,
  getUserForCurrentUser,
  getUserById,
  deleteUserById,
  UserActivity
} from '../controllers/userController';

router.route('/user/').get(getUserForCurrentUser)
router.route('/user/activity').get(UserActivity)
router.route('/users/')
  .get(getAllUsers)

router.route('/users/:userId')
  .get(getUserById)
  .delete(deleteUserById)
export default router