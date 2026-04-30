import { Request, Response } from 'express';
import { SetMeal, SetMealDish, Dish } from '../models';

class SetMealController {


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


      res.status(500).json({ error: '获取套餐列表失败' });
    }
  }



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

      res.json(newSetMeal);
    } catch (error) {

      res.status(500).json({ error: '创建套餐失败' });
    }
  }



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


      res.status(500).json({ error: '获取套餐详情失败' });
    }
  }



  static async updateSetMeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, price, description, dishes, isVisible } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const setMeal = await SetMeal.findByPk(id);
      if (!setMeal) {
        return res.status(404).json({ error: '套餐不存在' });
      }


      const dishCount = dishes && dishes.length > 0 ? dishes.length : 0;

      await setMeal.update({
        name: name || setMeal.name,
        type: type || setMeal.type,
        price: price !== undefined ? price : setMeal.price,
        description: description || setMeal.description,
        dishCount: dishCount,
        isVisible: isVisible !== undefined ? isVisible : setMeal.isVisible,
        updatedBy: username
      });


      if (dishes !== undefined) {
        await SetMealDish.destroy({ where: { set_meal_id: id } });

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


      res.json(updatedSetMeal);
    } catch (error) {
      res.status(500).json({ error: '更新套餐失败' });
    }
  }



  static async deleteSetMeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const setMeal = await SetMeal.findByPk(id);
      if (!setMeal) {
        return res.status(404).json({ error: '套餐不存在' });
      }


      await setMeal.destroy();
      res.json({ message: '套餐删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除套餐失败' });
    }
  }

  static async toggleVisibility(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isVisible } = req.body;
      const setMeal = await SetMeal.findByPk(id);
      if (!setMeal) {
        return res.status(404).json({ error: '套餐不存在' });
      }

      await setMeal.update({ isVisible: isVisible !== undefined ? isVisible : !setMeal.isVisible });

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

      res.json(updatedSetMeal);
    } catch (error) {
      res.status(500).json({ error: '更新上架状态失败' });
    }
  }
}


export default SetMealController;

