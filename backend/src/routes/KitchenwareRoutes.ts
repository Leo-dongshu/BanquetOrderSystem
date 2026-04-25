import express from 'express';
import KitchenwareController from '../controllers/KitchenwareController';

const router = express.Router();

router.get('/kitchenwares', KitchenwareController.getKitchenwares);
router.post('/kitchenwares', KitchenwareController.createKitchenware);
router.get('/kitchenwares/:id', KitchenwareController.getKitchenwareById);
router.put('/kitchenwares/:id', KitchenwareController.updateKitchenware);
router.delete('/kitchenwares/:id', KitchenwareController.deleteKitchenware);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
