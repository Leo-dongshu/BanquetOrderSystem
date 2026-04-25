import express from 'express';
import SetMealController from '../controllers/SetMealController';

const router = express.Router();

router.get('/set-meals', SetMealController.getSetMeals);
router.post('/set-meals', SetMealController.createSetMeal);
router.get('/set-meals/:id', SetMealController.getSetMealById);
router.put('/set-meals/:id', SetMealController.updateSetMeal);
router.delete('/set-meals/:id', SetMealController.deleteSetMeal);

export default router;