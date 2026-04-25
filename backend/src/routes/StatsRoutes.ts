import express from 'express';
import StatsController from '../controllers/StatsController';

const router = express.Router();

router.get('/stats/ingredients', StatsController.getIngredientStats);
router.get('/stats/orders', StatsController.getOrderStats);


router.get('/stats/dashboard', StatsController.getDashboardStats);

export default router;