import express from 'express';
import OrderController from '../controllers/OrderController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', OrderController.getOrders);
router.post('/', authMiddleware, OrderController.createOrder);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', authMiddleware, OrderController.updateOrder);
router.delete('/:id', authMiddleware, OrderController.deleteOrder);

export default router;