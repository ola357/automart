import express from 'express';
import OrdersController from '../controllers/OrdersController';
import AuthoriseRoutes from '../middleware/AuthoriseRoutes';

const router = express.Router();

router.post('/', AuthoriseRoutes.protect, OrdersController.createPurchaseOrder);
router.patch('/:orderId/price', AuthoriseRoutes.protect, OrdersController.updateOrderPrice);
export default router;
