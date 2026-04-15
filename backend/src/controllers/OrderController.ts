import { Request, Response } from 'express';
import { Order, OrderDish, Dish, OrderSetMeal, SetMeal, SetMealDish } from '../models';
import { Op } from 'sequelize';

class OrderController {
  // 获取订单列表
  static async getOrders(req: Request, res: Response) {
    try {
      const { start_date, end_date, customer_phone } = req.query;
      const where: any = {};

      // 时间范围搜索
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

      // 电话号码搜索
      if (customer_phone) {
        where.customer_phone = {
          [Op.like]: `%${customer_phone}%`
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
      res.json(orders);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      res.status(500).json({ error: '获取订单列表失败' });
    }
  }

  // 创建新订单
  static async createOrder(req: Request, res: Response) {
    try {
      const { customer_name, customer_phone, service_address, service_date, table_count, dishes, set_meals } = req.body;
      
      // 计算总金额：各菜品价格*数量的和 再乘桌数
      let total_amount = 0;
      
      // 计算菜品金额
      if (dishes) {
        for (const dish of dishes) {
          const dishInfo = await Dish.findByPk(dish.dish_id);
          if (dishInfo) {
            total_amount += parseFloat(dishInfo.price.toString()) * dish.quantity;
          }
        }
      }
      
      // 计算套餐金额
      if (set_meals) {
        for (const setMeal of set_meals) {
          const setMealInfo = await SetMeal.findByPk(setMeal.set_meal_id);
          if (setMealInfo) {
            total_amount += parseFloat(setMealInfo.price.toString());
          }
        }
      }
      
      total_amount *= table_count;

      // 获取当前用户
      const user = (req as any).user;
      const username = user ? user.username : 'system';

      // 创建订单
      const order = await Order.create({
        customer_name,
        customer_phone,
        service_address,
        service_date,
        table_count,
        total_amount,
        status: 'pending',
        createdBy: username,
        updatedBy: username
      });

      // 创建订单菜品关联
      if (dishes) {
        for (const dish of dishes) {
          await OrderDish.create({
            order_id: order.id,
            dish_id: dish.dish_id,
            quantity: dish.quantity
          });
        }
      }

      // 创建订单套餐关联
      if (set_meals) {
        for (const setMeal of set_meals) {
          await OrderSetMeal.create({
            order_id: order.id,
            set_meal_id: setMeal.set_meal_id
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error('创建订单失败:', error);
      res.status(500).json({ error: '创建订单失败' });
    }
  }

  // 获取订单详情
  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
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
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: '订单不存在' });
      }
    } catch (error) {
      console.error('获取订单详情失败:', error);
      res.status(500).json({ error: '获取订单详情失败' });
    }
  }

  // 更新订单
  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customer_name, customer_phone, service_address, service_date, table_count, status, dishes, set_meals } = req.body;

      // 获取当前用户
      const user = (req as any).user;
      const username = user ? user.username : 'system';

      // 查找订单
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      // 计算总金额：各菜品价格*数量的和 再乘桌数
      let total_amount = 0;
      
      // 计算菜品金额
      if (dishes) {
        for (const dish of dishes) {
          const dishInfo = await Dish.findByPk(dish.dish_id);
          if (dishInfo) {
            total_amount += parseFloat(dishInfo.price.toString()) * dish.quantity;
          }
        }
      }
      
      // 计算套餐金额
      if (set_meals) {
        for (const setMeal of set_meals) {
          const setMealInfo = await SetMeal.findByPk(setMeal.set_meal_id);
          if (setMealInfo) {
            total_amount += parseFloat(setMealInfo.price.toString());
          }
        }
      }
      
      total_amount *= table_count || order.table_count;

      // 更新订单信息
      await order.update({
        customer_name: customer_name || order.customer_name,
        customer_phone: customer_phone || order.customer_phone,
        service_address: service_address || order.service_address,
        service_date: service_date || order.service_date,
        table_count: table_count || order.table_count,
        total_amount,
        status: status || order.status,
        updatedBy: username
      });

      // 更新订单菜品关联
      if (dishes) {
        // 删除旧的关联
        await OrderDish.destroy({ where: { order_id: id } });
        // 创建新的关联
        for (const dish of dishes) {
          await OrderDish.create({
            order_id: order.id,
            dish_id: dish.dish_id,
            quantity: dish.quantity
          });
        }
      }

      // 更新订单套餐关联
      if (set_meals) {
        // 删除旧的关联
        await OrderSetMeal.destroy({ where: { order_id: id } });
        // 创建新的关联
        for (const setMeal of set_meals) {
          await OrderSetMeal.create({
            order_id: order.id,
            set_meal_id: setMeal.set_meal_id
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error('更新订单失败:', error);
      res.status(500).json({ error: '更新订单失败' });
    }
  }

  // 删除订单
  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      // 删除关联的订单菜品
      await OrderDish.destroy({ where: { order_id: id } });
      // 删除关联的订单套餐
      await OrderSetMeal.destroy({ where: { order_id: id } });
      // 删除订单
      await order.destroy();

      res.json({ message: '订单删除成功' });
    } catch (error) {
      console.error('删除订单失败:', error);
      res.status(500).json({ error: '删除订单失败' });
    }
  }
}

export default OrderController;