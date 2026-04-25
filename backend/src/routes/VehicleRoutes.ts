import express from 'express';
import VehicleController from '../controllers/VehicleController';

const router = express.Router();

// 获取车辆列表
router.get('/vehicles', VehicleController.getVehicles);

// 获取单个车辆
router.get('/vehicles/:id', VehicleController.getVehicle);

// 创建车辆
router.post('/vehicles', VehicleController.createVehicle);

// 更新车辆
router.put('/vehicles/:id', VehicleController.updateVehicle);

// 删除车辆
router.delete('/vehicles/:id', VehicleController.deleteVehicle);

export default router;