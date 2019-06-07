import express from 'express';
import CarsController from '../controllers/CarsController';

const router = express.Router();

router.post('/', CarsController.createCarAd);
router.patch('/:carId/status', CarsController.updateCarAdStatus);
router.patch('/:carId/price', CarsController.updateCarAdPrice);
router.get('/:carId', CarsController.getSpecificCar);
router.get('/', CarsController.getCars);
export default router;
