import express from 'express';
import cloudinary from 'cloudinary';
import CarsController from '../controllers/CarsController';
import upload from '../middleware/FormImageHandler';
import AuthoriseRoutes from '../middleware/AuthoriseRoutes';


const router = express.Router();
cloudinary.config({
  cloud_name: 'ola357',
  api_key: '294318289196749',
  api_secret: '_eT8SAXW2zjD0g8x2sJvTlughdg',
});
router.post('/', AuthoriseRoutes.protect, CarsController.createCarAd);
router.patch('/:carId/status', AuthoriseRoutes.protect, CarsController.updateCarAdStatus);
router.patch('/:carId/price', AuthoriseRoutes.protect, CarsController.updateCarAdPrice);
router.get('/:carId', CarsController.getSpecificCar);
router.get('/', CarsController.getCars);
router.post('/testing', upload.single('images'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
    console.log(result);
  });
  res.send('qualify');
});
export default router;
