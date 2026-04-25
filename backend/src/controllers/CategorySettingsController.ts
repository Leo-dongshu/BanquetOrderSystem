import { Request, Response } from 'express';
import { CategorySetting } from '../models';

class CategorySettingsController {
  static async getCategorySettings(req: Request, res: Response) {
    try {
      const { type } = req.query;
      const whereCondition = type ? { type } : {};


      const categorySettings = await CategorySetting.findAll({
        where: whereCondition,
        order: [['type', 'ASC'], ['created_at', 'DESC']]
      });
      res.json(categorySettings);
    } catch (error) {
      res.status(500).json({ error: '获取类别设置列表失败' });
    }
  }

  static async createCategorySetting(req: Request, res: Response) {
    try {
      const { type, name } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const categorySetting = await CategorySetting.create({
        type,
        name,
        createdBy: username,
        updatedBy: username
      });
      res.json(categorySetting);
    } catch (error) {
      res.status(500).json({ error: '创建类别设置失败' });
    }
  }

  static async getCategorySettingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categorySetting = await CategorySetting.findByPk(id);
      if (categorySetting) {
        res.json(categorySetting);
      } else {
        res.status(404).json({ error: '类别设置不存在' });
      }
    } catch (error) {
      res.status(500).json({ error: '获取类别设置详情失败' });
    }
  }

  static async updateCategorySetting(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type, name } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const categorySetting = await CategorySetting.findByPk(id);
      if (!categorySetting) {
        return res.status(404).json({ error: '类别设置不存在' });
      }
      await categorySetting.update({
        type: type || categorySetting.type,
        name: name || categorySetting.name,
        updatedBy: username
      });
      res.json(categorySetting);
    } catch (error) {
      res.status(500).json({ error: '更新类别设置失败' });
    }
  }

  static async deleteCategorySetting(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categorySetting = await CategorySetting.findByPk(id);
      if (!categorySetting) {
        return res.status(404).json({ error: '类别设置不存在' });
      }
      await categorySetting.destroy();
      res.json({ message: '类别设置删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除类别设置失败' });
    }
  }
}

export default CategorySettingsController;