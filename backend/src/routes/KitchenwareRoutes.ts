import express from 'express';
import KitchenwareController from '../controllers/KitchenwareController';

const router = express.Router();

router.get('/kitchenwares', KitchenwareController.getKitchenwares);
router.post('/kitchenwares', KitchenwareController.createKitchenware);
router.get('/kitchenwares/:id', KitchenwareController.getKitchenwareById);
router.put('/kitchenwares/:id', KitchenwareController.updateKitchenware);
router.delete('/kitchenwares/:id', KitchenwareController.deleteKitchenware);


export default router;

