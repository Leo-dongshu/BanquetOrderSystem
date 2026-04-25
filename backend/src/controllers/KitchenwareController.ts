import { Request, Response } from 'express';
import { Kitchenware } from '../models';

class KitchenwareController {
  static async getKitchenwares(req: Request, res: Response) {
    try {
      const kitchenwares = await Kitchenware.findAll();
      res.json(kitchenwares);
    } catch (error) {
      res.status(500).json({ error: '获取厨具列表失败' });
    }
  }

  static async createKitchenware(req: Request, res: Response) {
    try {
      const { name, type, quantity } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const kitchenware = await Kitchenware.create({
        name,
        type,
        quantity: quantity || 0,
        createdBy: username,
        updatedBy: username
      });
      res.json(kitchenware);
    } catch (error) {
      res.status(500).json({ error: '创建厨具失败' });
    }
  }

  static async getKitchenwareById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const kitchenware = await Kitchenware.findByPk(id);
      if (kitchenware) {
        res.json(kitchenware);
      } else {
        res.status(404).json({ error: '厨具不存在' });
      }
    } catch (error) {
      res.status(500).json({ error: '获取厨具详情失败' });
    }
  }

  static async updateKitchenware(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, quantity } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const kitchenware = await Kitchenware.findByPk(id);
      if (!kitchenware) {
        return res.status(404).json({ error: '厨具不存在' });
      }
      await kitchenware.update({
        name: name || kitchenware.name,
        type: type || kitchenware.type,
        quantity: quantity !== undefined ? quantity : kitchenware.quantity,
        updatedBy: username
      });
      res.json(kitchenware);
    } catch (error) {
      res.status(500).json({ error: '更新厨具失败' });
    }
  }

  static async deleteKitchenware(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const kitchenware = await Kitchenware.findByPk(id);
      if (!kitchenware) {
        return res.status(404).json({ error: '厨具不存在' });
      }
      await kitchenware.destroy();
      res.json({ message: '厨具删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除厨具失败' });
    }
  }
}

export default KitchenwareController;