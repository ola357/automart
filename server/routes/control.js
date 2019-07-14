import express from 'express';
import Control from '../controllers/Control';

const router = express.Router();

router.get('/', Control.getRoot);
router.get('/data', Control.getTables);
router.patch('/data', Control.makeAdmin);
export default router;
