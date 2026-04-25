import { Request, Response } from 'express';
import { Kitchenware } from '../models';

class KitchenwareController {
<<<<<<< HEAD
  // 获取厨具列表
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async getKitchenwares(req: Request, res: Response) {
    try {
      const kitchenwares = await Kitchenware.findAll();
      res.json(kitchenwares);
    } catch (error) {
      res.status(500).json({ error: '获取厨具列表失败' });
    }
  }

<<<<<<< HEAD
  // 创建新厨具
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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

<<<<<<< HEAD
  // 获取厨具详情
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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

<<<<<<< HEAD
  // 更新厨具
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      await kitchenware.update({
        name: name || kitchenware.name,
        type: type || kitchenware.type,
        quantity: quantity !== undefined ? quantity : kitchenware.quantity,
        updatedBy: username
      });
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.json(kitchenware);
    } catch (error) {
      res.status(500).json({ error: '更新厨具失败' });
    }
  }

<<<<<<< HEAD
  // 删除厨具
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async deleteKitchenware(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const kitchenware = await Kitchenware.findByPk(id);
      if (!kitchenware) {
        return res.status(404).json({ error: '厨具不存在' });
      }
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      await kitchenware.destroy();
      res.json({ message: '厨具删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除厨具失败' });
    }
  }
}

<<<<<<< HEAD
export default KitchenwareController;
=======
export default KitchenwareController;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
