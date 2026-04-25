import express from 'express';
import IngredientController from '../controllers/IngredientController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', IngredientController.getIngredients);
router.post('/', authMiddleware, IngredientController.createIngredient);
router.get('/:id', IngredientController.getIngredientById);
router.put('/:id', authMiddleware, IngredientController.updateIngredient);
router.delete('/:id', authMiddleware, IngredientController.deleteIngredient);

export default router;