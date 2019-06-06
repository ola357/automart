import express from 'express';
import OrdersController from '../controllers/OrdersController';

const router = express.Router();

router.post('/', OrdersController.createPurchaseOrder);
export default router;
