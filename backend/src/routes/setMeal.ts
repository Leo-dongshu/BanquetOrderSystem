import express from 'express';
import SetMealController from '../controllers/SetMealController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', SetMealController.getSetMeals);
router.post('/', authMiddleware, SetMealController.createSetMeal);
router.get('/:id', SetMealController.getSetMealById);
router.put('/:id', authMiddleware, SetMealController.updateSetMeal);
router.delete('/:id', authMiddleware, SetMealController.deleteSetMeal);

export default router;