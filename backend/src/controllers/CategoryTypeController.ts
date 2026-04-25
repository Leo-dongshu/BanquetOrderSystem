import { Request, Response } from 'express';
import { CategoryType, CategorySetting } from '../models';

class CategoryTypeController {
  static async getCategoryTypes(req: Request, res: Response) {
    try {
      const categoryTypes = await CategoryType.findAll({
        order: [['created_at', 'DESC']]
      });
      res.json(categoryTypes);
    } catch (error) {
      res.status(500).json({ error: '获取类别类型列表失败' });
    }
  }

  static async createCategoryType(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const categoryType = await CategoryType.create({
        name,
        createdBy: username,
        updatedBy: username
      });
      res.json(categoryType);
    } catch (error) {
      res.status(500).json({ error: '创建类别类型失败' });
    }
  }

  static async getCategoryTypeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryType = await CategoryType.findByPk(id);
      if (categoryType) {
        res.json(categoryType);
      } else {
        res.status(404).json({ error: '类别类型不存在' });
      }
    } catch (error) {
      res.status(500).json({ error: '获取类别类型详情失败' });
    }
  }

  static async updateCategoryType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const categoryType = await CategoryType.findByPk(id);
      if (!categoryType) {
        return res.status(404).json({ error: '类别类型不存在' });
      }
      await categoryType.update({
        name: name || categoryType.name,
        updatedBy: username
      });
      res.json(categoryType);
    } catch (error) {
      res.status(500).json({ error: '更新类别类型失败' });
    }
  }

  static async deleteCategoryType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryType = await CategoryType.findByPk(id);
      if (!categoryType) {
        return res.status(404).json({ error: '类别类型不存在' });
      }
      
      // 删除该类型下的所有类别设置
      await CategorySetting.destroy({
        where: { type: categoryType.name }
      });
      
      await categoryType.destroy();
      res.json({ message: '类别类型删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除类别类型失败' });
    }
  }
}

export default CategoryTypeController;