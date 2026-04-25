import express from 'express';
import OrderController from '../controllers/OrderController';

const router = express.Router();

router.get('/orders', OrderController.getOrders);
router.post('/orders', OrderController.createOrder);
router.get('/orders/:id', OrderController.getOrderById);
router.put('/orders/:id', OrderController.updateOrder);
router.delete('/orders/:id', OrderController.deleteOrder);

// 人员安排相关路由
router.post('/orders/staff-arrangement', OrderController.saveStaffArrangement);
router.get('/orders/:order_id/staff-arrangement', OrderController.getStaffArrangement);

// 订单状态相关路由
router.get('/order-statuses', OrderController.getOrderStatuses);
router.get('/orders/:order_id/status-history', OrderController.getOrderStatusHistory);
router.put('/orders/:order_id/status', OrderController.updateOrderStatus);

// 回款确认
router.post('/orders/:order_id/payment', OrderController.confirmPayment);

// 获取订单菜品
router.get('/orders/:order_id/dishes', OrderController.getOrderDishes);

export default router;