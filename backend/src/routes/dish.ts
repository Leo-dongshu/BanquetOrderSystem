import express from 'express';
import DishController from '../controllers/DishController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', DishController.getDishes);
router.post('/', authMiddleware, DishController.createDish);
router.get('/:id', DishController.getDishById);
router.put('/:id', authMiddleware, DishController.updateDish);
router.delete('/:id', authMiddleware, DishController.deleteDish);

export default router;