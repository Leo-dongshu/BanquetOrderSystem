import { Request, Response } from 'express';
import { Dish, DishIngredient, Ingredient } from '../models';

class DishController {
<<<<<<< HEAD
  // 获取菜品列表
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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

<<<<<<< HEAD
  // 创建新菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async createDish(req: Request, res: Response) {
    try {
      const { name, dishware, cookingMethod, cookingDescription, ingredients } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
<<<<<<< HEAD

      // 创建菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const dish = await Dish.create({
        name,
        dishware,
        cookingMethod,
        cookingDescription,
        createdBy: username,
        updatedBy: username
      });

<<<<<<< HEAD
      // 创建菜品用料关联
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      if (ingredients) {
        for (const ingredient of ingredients) {
          await DishIngredient.create({
            dish_id: dish.id,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity
          });
        }
      }
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: '创建菜品失败' });
    }
  }

<<<<<<< HEAD
  // 获取菜品详情
  static async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('获取菜品详情,id:', id);
=======
  static async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
<<<<<<< HEAD
      console.log('获取到的菜品:', dish);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      if (dish) {
        res.json(dish);
      } else {
        res.status(404).json({ error: '菜品不存在' });
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('获取菜品详情失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '获取菜品详情失败' });
    }
  }

<<<<<<< HEAD
  // 更新菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async updateDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, dishware, cookingMethod, cookingDescription, ingredients } = req.body;
<<<<<<< HEAD

      // 查找菜品
=======
      const user = (req as any).user;
      const username = user ? user.username : 'system';
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: '菜品不存在' });
      }
<<<<<<< HEAD

      // 获取当前用户
      const user = (req as any).user;
      const username = user ? user.username : 'system';

      // 更新菜品信息
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      await dish.update({
        name: name || dish.name,
        dishware: dishware || dish.dishware,
        cookingMethod: cookingMethod || dish.cookingMethod,
        cookingDescription: cookingDescription || dish.cookingDescription,
        updatedBy: username
      });

<<<<<<< HEAD
      // 更新菜品用料关联
      if (ingredients) {
        // 删除旧的关联
        await DishIngredient.destroy({ where: { dish_id: id } });
        // 创建新的关联
=======
      if (ingredients) {
        await DishIngredient.destroy({ where: { dish_id: id } });
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
        for (const ingredient of ingredients) {
          await DishIngredient.create({
            dish_id: dish.id,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity
          });
        }
      }
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: '更新菜品失败' });
    }
  }

<<<<<<< HEAD
  // 删除菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async deleteDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ error: '菜品不存在' });
      }
<<<<<<< HEAD

      // 删除关联的菜品用料
      await DishIngredient.destroy({ where: { dish_id: id } });
      // 删除菜品
      await dish.destroy();

=======
      await DishIngredient.destroy({ where: { dish_id: id } });
      await dish.destroy();
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.json({ message: '菜品删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除菜品失败' });
    }
  }
}

export default DishController;