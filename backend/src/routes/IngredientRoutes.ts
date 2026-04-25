import express from 'express';
import IngredientController from '../controllers/IngredientController';

const router = express.Router();

router.get('/ingredients', IngredientController.getIngredients);
router.post('/ingredients', IngredientController.createIngredient);
router.get('/ingredients/:id', IngredientController.getIngredientById);
router.put('/ingredients/:id', IngredientController.updateIngredient);
router.delete('/ingredients/:id', IngredientController.deleteIngredient);

export default router;