import express from 'express';
import OrdersController from '../controllers/OrdersController';

const router = express.Router();

router.post('/', OrdersController.createPurchaseOrder);
router.patch('/:orderId/price', OrdersController.updateOrderPrice);
export default router;
