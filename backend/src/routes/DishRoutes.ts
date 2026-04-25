import express from 'express';
import DishController from '../controllers/DishController';

const router = express.Router();

router.get('/dishes', DishController.getDishes);
router.post('/dishes', DishController.createDish);
router.get('/dishes/:id', DishController.getDishById);
router.put('/dishes/:id', DishController.updateDish);
router.delete('/dishes/:id', DishController.deleteDish);

export default router;