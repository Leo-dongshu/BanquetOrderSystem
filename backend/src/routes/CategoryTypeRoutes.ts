import express from 'express';
import CategoryTypeController from '../controllers/CategoryTypeController';

const router = express.Router();

router.get('/category-types', CategoryTypeController.getCategoryTypes);
router.post('/category-types', CategoryTypeController.createCategoryType);
router.get('/category-types/:id', CategoryTypeController.getCategoryTypeById);
router.put('/category-types/:id', CategoryTypeController.updateCategoryType);
router.delete('/category-types/:id', CategoryTypeController.deleteCategoryType);

export default router;