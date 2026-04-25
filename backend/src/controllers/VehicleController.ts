import { Request, Response } from 'express';
import { Vehicle } from '../models';

class VehicleController {
  // 获取车辆列表
  async getVehicles(req: Request, res: Response) {
    try {
      const vehicles = await Vehicle.findAll({
        order: [['created_at', 'DESC']],
      });
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('获取车辆列表失败:', error);
      res.status(500).json({ error: '获取车辆列表失败' });
    }
  }

  // 获取单个车辆
  async getVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: '车辆不存在' });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      console.error('获取车辆失败:', error);
      res.status(500).json({ error: '获取车辆失败' });
    }
  }

  // 创建车辆
  async createVehicle(req: Request, res: Response) {
    try {
      const { plateNumber, type, brand, status, createdBy, updatedBy } = req.body;
      // 优先使用前端传递的用户信息，其次从认证中间件获取，最后使用默认值
      const user = (req as any).user;
      const username = createdBy || updatedBy || (user ? user.username : 'admin');

      const vehicle = await Vehicle.create({
        plateNumber,
        type,
        brand,
        status,
        createdBy: username,
        updatedBy: username,
      });

      res.status(201).json(vehicle);
    } catch (error) {
      console.error('创建车辆失败:', error);
      res.status(500).json({ error: '创建车辆失败' });
    }
  }

  // 更新车辆
  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { plateNumber, type, brand, status, updatedBy } = req.body;
      // 优先使用前端传递的用户信息，其次从认证中间件获取，最后使用默认值
      const user = (req as any).user;
      const username = updatedBy || (user ? user.username : 'admin');

      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: '车辆不存在' });
      }

      await vehicle.update({
        plateNumber,
        type,
        brand,
        status,
        updatedBy: username,
      });

      res.status(200).json(vehicle);
    } catch (error) {
      console.error('更新车辆失败:', error);
      res.status(500).json({ error: '更新车辆失败' });
    }
  }

  // 删除车辆
  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: '车辆不存在' });
      }

      await vehicle.destroy();
      res.status(200).json({ message: '删除车辆成功' });
    } catch (error) {
      console.error('删除车辆失败:', error);
      res.status(500).json({ error: '删除车辆失败' });
    }
  }
}

export default new VehicleController();