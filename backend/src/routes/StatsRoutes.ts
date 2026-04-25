import express from 'express';
import StatsController from '../controllers/StatsController';

const router = express.Router();

router.get('/stats/ingredients', StatsController.getIngredientStats);
router.get('/stats/orders', StatsController.getOrderStats);
<<<<<<< HEAD
router.get('/stats/export-ingredients', StatsController.exportIngredientStats);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
router.get('/stats/dashboard', StatsController.getDashboardStats);

export default router;