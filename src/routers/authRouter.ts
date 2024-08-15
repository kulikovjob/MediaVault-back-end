// // authRouter.ts
// import express, { Request, Response } from 'express';
// import { BaseModel } from '../models/baseModel';
// import { MediaModel } from '../models/mediaModel';
//
// const router = express.Router();
//
// router.post('/login', async (req: Request, res: Response) => {
//   try {
//     const { username, password } = req.body;
//
//     // Создаем экземпляр BaseModel с переданным логином и паролем
//     //const baseModel = BaseModel.getInstance(username, password);
//
//     // Передаем экземпляр BaseModel в MediaModel
//     const mediaModel = new MediaModel(baseModel);
//
//     // Продолжаем с аутентифицированным экземпляром модели
//     // ...
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
//
// export default router;
// authRouter.js

import express from 'express';
import { authenticateUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', authenticateUser);

export default router;
