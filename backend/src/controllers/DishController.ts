import { Request, Response } from 'express';
import { Dish, DishIngredient, Ingredient } from '../models';

class DishController {
  // 获取菜品列表
  static async getDishes(req: Request, res: Response) {
    try {
      const dishes = await Dish.findAll({
        include: [{
          model: DishIngredient,
          as: 'dish_ingredients',
          include: [{
            model: Ingredient,
            as: 'ingredient'
          }]
        }]
      });
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ error: '获取菜品列表失败' });
    }
  }

  // 创建新菜品
  static async createDish(req: Request, res: Response) {
    try {
      const { name, price, description, ingredients } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';

      // 创建菜品
      const dish = await Dish.create({
        name,
        price,
        description,
        createdBy: username,
        updatedBy: username
      });

      // 创建菜品用料关联
      if (ingredients) {
        for (const ingredient of ingredients) {
          await DishIngredient.create({
            dish_id: dish.id,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity
          });
        }
      }

      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: '创建菜品失败' });
    }
  }

  // 获取菜品详情
  static async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('获取菜品详情，id:', id);
      const dish = await Dish.findByPk(id, {
        include: [{
          model: DishIngredient,
          as: 'dish_ingredients',
          include: [{
            model: Ingredient,
            as: 'ingredient'
          }]
        }]
      });
      console.log('获取到的菜品:', dish);
      if (dish) {
        res.json(dish);
      } else {
        res.status(404).json({ error: '菜品不存在' });
      }
    } catch (error) {
      console.error('获取菜品详情失败:', error);
      res.status(500).json({ error: '获取菜品详情失败' });
    }
  }

  // 更新菜品
  static async updateDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, description, ingredients } = req.body;

      // 获取当前用户
      const user = (req as any).user;
      const username = user ? user.username : 'system';

      // 查找菜品
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: '菜品不存在' });
      }

      // 更新菜品信息
      await dish.update({
        name: name || dish.name,
        price: price || dish.price,
        description: description || dish.description,
        updatedBy: username
      });

      // 更新菜品用料关联
      if (ingredients) {
        // 删除旧的关联
        await DishIngredient.destroy({ where: { dish_id: id } });
        // 创建新的关联
        for (const ingredient of ingredients) {
          await DishIngredient.create({
            dish_id: dish.id,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity
          });
        }
      }

      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: '更新菜品失败' });
    }
  }

  // 删除菜品
  static async deleteDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: '菜品不存在' });
      }

      // 删除关联的菜品用料
      await DishIngredient.destroy({ where: { dish_id: id } });
      // 删除菜品
      await dish.destroy();

      res.json({ message: '菜品删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除菜品失败' });
    }
  }
}

export default DishController;