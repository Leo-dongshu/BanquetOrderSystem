import { Request, Response } from 'express';
import { Ingredient } from '../models';

class IngredientController {
  // 获取用料列表
  static async getIngredients(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const whereCondition = category ? { category } : {};
      
      const ingredients = await Ingredient.findAll({
        where: whereCondition,
        order: [['category', 'ASC'], ['created_at', 'DESC']]
      });
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: '获取用料列表失败' });
    }
  }

  // 创建新用料
  static async createIngredient(req: Request, res: Response) {
    try {
      const { name, unit, quantity, category } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const ingredient = await Ingredient.create({
        name,
        unit,
        quantity: quantity || 0,
        category,
        createdBy: username,
        updatedBy: username
      });
      res.json(ingredient);
    } catch (error) {
      res.status(500).json({ error: '创建用料失败' });
    }
  }

  // 获取用料详情
  static async getIngredientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ingredient = await Ingredient.findByPk(id);
      if (ingredient) {
        res.json(ingredient);
      } else {
        res.status(404).json({ error: '用料不存在' });
      }
    } catch (error) {
      res.status(500).json({ error: '获取用料详情失败' });
    }
  }

  // 更新用料
  static async updateIngredient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, unit, quantity, category } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const ingredient = await Ingredient.findByPk(id);
      if (!ingredient) {
        return res.status(404).json({ error: '用料不存在' });
      }

      await ingredient.update({
        name: name || ingredient.name,
        unit: unit || ingredient.unit,
        quantity: quantity !== undefined ? quantity : ingredient.quantity,
        category: category || ingredient.category,
        updatedBy: username
      });

      res.json(ingredient);
    } catch (error) {
      res.status(500).json({ error: '更新用料失败' });
    }
  }

  // 删除用料
  static async deleteIngredient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ingredient = await Ingredient.findByPk(id);
      if (!ingredient) {
        return res.status(404).json({ error: '用料不存在' });
      }

      await ingredient.destroy();
      res.json({ message: '用料删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除用料失败' });
    }
  }
}

export default IngredientController;