import { Router } from 'express';

import {
  getAllUsers,
  getUserForCurrentUser,
  getUserById,
  deleteUserById,
} from '../controllers/userController';
import { connectToModel } from '../controllers/mediaController';
import { UserModel } from '../models/userModel';

const router = Router();

router.use(connectToModel(UserModel));

router.route('/user/').get(getUserForCurrentUser);
router.route('/users/').get(getAllUsers);

router.route('/users/:userId').get(getUserById).delete(deleteUserById);
export default router;
