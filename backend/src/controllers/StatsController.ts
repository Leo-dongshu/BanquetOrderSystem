import { Request, Response } from 'express';
import { Order, OrderDish, Dish, OrderSetMeal, SetMeal, SetMealDish, DishIngredient, Ingredient } from '../models';
import { Op } from 'sequelize';

class StatsController {
  // 获取订单统计
  static async getOrderStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      const where: any = {};

      if (start_date) {
        where.service_date = {
          ...where.service_date,
          [Op.gte]: new Date(start_date as string)
        };
      }
      if (end_date) {
        where.service_date = {
          ...where.service_date,
          [Op.lte]: new Date(end_date as string)
        };
      }

      const orders = await Order.findAll({
        where,
        include: [{
          model: OrderDish,
          as: 'order_dishes',
          include: [{
            model: Dish,
            as: 'dish'
          }]
        }, {
          model: OrderSetMeal,
          as: 'order_set_meals',
          include: [{
            model: SetMeal,
            as: 'set_meal',
            include: [{
              model: SetMealDish,
              as: 'set_meal_dishes',
              include: [{
                model: Dish,
                as: 'dish'
              }]
            }]
          }]
        }]
      });

      // 计算总订单数、总金额、总桌数
      const totalOrders = orders.length;
      const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);
      const totalTables = orders.reduce((sum, order) => sum + order.table_count, 0);

      res.json({
        totalOrders,
        totalAmount,
        totalTables
      });
    } catch (error) {
      res.status(500).json({ error: '获取订单统计失败' });
    }
  }

  // 获取食材需求统计
  static async getIngredientStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      const where: any = {
        status: 'confirmed' // 只查询已确认的订单
      };

      if (start_date) {
        where.service_date = {
          ...where.service_date,
          [Op.gte]: new Date(start_date as string)
        };
      }
      if (end_date) {
        where.service_date = {
          ...where.service_date,
          [Op.lte]: new Date(end_date as string)
        };
      }

      const orders = await Order.findAll({
        where,
        include: [{
          model: OrderDish,
          as: 'order_dishes',
          include: [{
            model: Dish,
            as: 'dish',
            include: [{
              model: DishIngredient,
              as: 'dish_ingredients',
              include: [{
                model: Ingredient,
                as: 'ingredient'
              }]
            }]
          }]
        }, {
          model: OrderSetMeal,
          as: 'order_set_meals',
          include: [{
            model: SetMeal,
            as: 'set_meal',
            include: [{
              model: SetMealDish,
              as: 'set_meal_dishes',
              include: [{
                model: Dish,
                as: 'dish',
                include: [{
                  model: DishIngredient,
                  as: 'dish_ingredients',
                  include: [{
                    model: Ingredient,
                    as: 'ingredient'
                  }]
                }]
              }]
            }]
          }]
        }]
      });

      // 计算食材需求
      const ingredientMap = new Map();

      orders.forEach(order => {
        // 处理订单中的菜品
        order.order_dishes?.forEach(orderDish => {
          orderDish.dish?.dish_ingredients?.forEach(dishIngredient => {
            const ingredient = dishIngredient.ingredient;
            if (ingredient) {
              const key = ingredient.id;
              const existing = ingredientMap.get(key) || {
                name: ingredient.name,
                category: ingredient.category,
                total: 0
              };
              // 计算公式：订单桌数 * 菜品数量 * 菜品中的单位 * 菜品中的用量
              existing.total += order.table_count * orderDish.quantity * parseFloat(ingredient.unit) * dishIngredient.quantity;
              ingredientMap.set(key, existing);
            }
          });
        });

        // 处理订单中的套餐
        order.order_set_meals?.forEach(orderSetMeal => {
          orderSetMeal.set_meal?.set_meal_dishes?.forEach(setMealDish => {
            setMealDish.dish?.dish_ingredients?.forEach(dishIngredient => {
              const ingredient = dishIngredient.ingredient;
              if (ingredient) {
                const key = ingredient.id;
                const existing = ingredientMap.get(key) || {
                  name: ingredient.name,
                  category: ingredient.category,
                  total: 0
                };
                // 计算公式：订单桌数 * 套餐中菜品数量 * 菜品中的单位 * 菜品中的用量
                existing.total += order.table_count * setMealDish.quantity * parseFloat(ingredient.unit) * dishIngredient.quantity;
                ingredientMap.set(key, existing);
              }
            });
          });
        });
      });

      // 转换为数组并按分类分组
      const ingredients = Array.from(ingredientMap.values());

      res.json(ingredients);
    } catch (error) {
      console.error('获取食材需求统计失败:', error);
      res.status(500).json({ error: '获取食材需求统计失败' });
    }
  }
}

export default StatsController;