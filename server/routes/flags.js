import express from 'express';
import FlagsController from '../controllers/FlagsController';
import AuthoriseRoutes from '../middleware/AuthoriseRoutes';

const router = express.Router();

router.post('/', AuthoriseRoutes.protect, FlagsController.createFlags);
export default router;
