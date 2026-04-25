import { Request, Response } from 'express';
import { Dish, DishIngredient, Ingredient } from '../models';

class DishController {
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

  static async createDish(req: Request, res: Response) {
    try {
      const { name, dishware, cookingMethod, cookingDescription, ingredients } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const dish = await Dish.create({
        name,
        dishware,
        cookingMethod,
        cookingDescription,
        createdBy: username,
        updatedBy: username
      });

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

  static async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;
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
      if (dish) {
        res.json(dish);
      } else {
        res.status(404).json({ error: '菜品不存在' });
      }
    } catch (error) {
      res.status(500).json({ error: '获取菜品详情失败' });
    }
  }

  static async updateDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, dishware, cookingMethod, cookingDescription, ingredients } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: '菜品不存在' });
      }
      await dish.update({
        name: name || dish.name,
        dishware: dishware || dish.dishware,
        cookingMethod: cookingMethod || dish.cookingMethod,
        cookingDescription: cookingDescription || dish.cookingDescription,
        updatedBy: username
      });

      if (ingredients) {
        await DishIngredient.destroy({ where: { dish_id: id } });
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

  static async deleteDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: '菜品不存在' });
      }
      await DishIngredient.destroy({ where: { dish_id: id } });
      await dish.destroy();
      res.json({ message: '菜品删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除菜品失败' });
    }
  }
}

export default DishController;