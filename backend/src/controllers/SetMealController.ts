import { Request, Response } from 'express';
import { SetMeal, SetMealDish, Dish } from '../models';

class SetMealController {
<<<<<<< HEAD
  // 获取套餐列表
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async getSetMeals(req: Request, res: Response) {
    try {
      const setMeals = await SetMeal.findAll({
        include: [{
          model: SetMealDish,
          as: 'set_meal_dishes',
          include: [{
            model: Dish,
            as: 'dish'
          }]
        }]
      });
      res.json(setMeals);
    } catch (error) {
<<<<<<< HEAD
      console.error('获取套餐列表失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '获取套餐列表失败' });
    }
  }

<<<<<<< HEAD
  // 创建新套餐
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async createSetMeal(req: Request, res: Response) {
    try {
      const { name, type, price, description, dishes } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const dishCount = dishes && dishes.length > 0 ? dishes.length : 0;
      const setMeal = await SetMeal.create({
        name,
        type,
        price,
        description,
        dishCount,
        isVisible: true,
        createdBy: username,
        updatedBy: username
      });

<<<<<<< HEAD
      // 添加套餐包含的菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      if (dishes && dishes.length > 0) {
        await Promise.all(
          dishes.map((dish: { dish_id: number; quantity: number }) =>
            SetMealDish.create({
              set_meal_id: setMeal.id,
              dish_id: dish.dish_id,
              quantity: dish.quantity
            })
          )
        );
      }

<<<<<<< HEAD
      // 重新获取套餐信息，包含菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const newSetMeal = await SetMeal.findByPk(setMeal.id, {
        include: [{
          model: SetMealDish,
          as: 'set_meal_dishes',
          include: [{
            model: Dish,
            as: 'dish'
          }]
        }]
      });
<<<<<<< HEAD

      res.json(newSetMeal);
    } catch (error) {
      console.error('创建套餐失败:', error);
=======
      res.json(newSetMeal);
    } catch (error) {
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '创建套餐失败' });
    }
  }

<<<<<<< HEAD
  // 获取套餐详情
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async getSetMealById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const setMeal = await SetMeal.findByPk(id, {
        include: [{
          model: SetMealDish,
          as: 'set_meal_dishes',
          include: [{
            model: Dish,
            as: 'dish'
          }]
        }]
      });
      if (setMeal) {
        res.json(setMeal);
      } else {
        res.status(404).json({ error: '套餐不存在' });
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('获取套餐详情失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '获取套餐详情失败' });
    }
  }

<<<<<<< HEAD
  // 更新套餐
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async updateSetMeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, price, description, dishes } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const setMeal = await SetMeal.findByPk(id);
      if (!setMeal) {
        return res.status(404).json({ error: '套餐不存在' });
      }

<<<<<<< HEAD
      // 计算菜品数量
      const dishCount = dishes && dishes.length > 0 ? dishes.length : 0;

      // 更新套餐基本信息
=======
      const dishCount = dishes && dishes.length > 0 ? dishes.length : 0;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      await setMeal.update({
        name: name || setMeal.name,
        type: type || setMeal.type,
        price: price !== undefined ? price : setMeal.price,
        description: description || setMeal.description,
        dishCount: dishCount,
        updatedBy: username
      });

<<<<<<< HEAD
      // 更新套餐包含的菜品
      if (dishes !== undefined) {
        // 删除原有菜品
        await SetMealDish.destroy({ where: { set_meal_id: id } });
        // 添加新菜品
=======
      if (dishes !== undefined) {
        await SetMealDish.destroy({ where: { set_meal_id: id } });
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
        if (dishes.length > 0) {
          await Promise.all(
            dishes.map((dish: { dish_id: number; quantity: number }) =>
              SetMealDish.create({
                set_meal_id: setMeal.id,
                dish_id: dish.dish_id,
                quantity: dish.quantity
              })
            )
          );
        }
      }

<<<<<<< HEAD
      // 重新获取套餐信息，包含菜品
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const updatedSetMeal = await SetMeal.findByPk(setMeal.id, {
        include: [{
          model: SetMealDish,
          as: 'set_meal_dishes',
          include: [{
            model: Dish,
            as: 'dish'
          }]
        }]
      });
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.json(updatedSetMeal);
    } catch (error) {
      res.status(500).json({ error: '更新套餐失败' });
    }
  }

<<<<<<< HEAD
  // 删除套餐
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async deleteSetMeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const setMeal = await SetMeal.findByPk(id);
      if (!setMeal) {
        return res.status(404).json({ error: '套餐不存在' });
      }
<<<<<<< HEAD

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      await setMeal.destroy();
      res.json({ message: '套餐删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除套餐失败' });
    }
  }
}

<<<<<<< HEAD
export default SetMealController;
=======
export default SetMealController;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
