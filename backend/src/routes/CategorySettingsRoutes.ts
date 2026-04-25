import express from 'express';
import CategorySettingsController from '../controllers/CategorySettingsController';

const router = express.Router();

router.get('/category-settings', CategorySettingsController.getCategorySettings);
router.post('/category-settings', CategorySettingsController.createCategorySetting);
router.get('/category-settings/:id', CategorySettingsController.getCategorySettingById);
router.put('/category-settings/:id', CategorySettingsController.updateCategorySetting);
router.delete('/category-settings/:id', CategorySettingsController.deleteCategorySetting);

export default router;