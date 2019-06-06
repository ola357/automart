import express from 'express';
import CarsController from '../controllers/CarsController';

const router = express.Router();

router.post('/', CarsController.createCarAd);
export default router;
