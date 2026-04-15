import express from 'express';
import StatsController from '../controllers/StatsController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/orders', authMiddleware, StatsController.getOrderStats);
router.get('/ingredients', authMiddleware, StatsController.getIngredientStats);

export default router;