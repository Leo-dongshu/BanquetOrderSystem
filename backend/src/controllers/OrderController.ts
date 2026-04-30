import { Request, Response } from 'express';
import { Order, OrderDish, Dish, SetMeal, SetMealDish, OrderStaffArrangement, OrderStatus, OrderStatusHistory, Ingredient, DishIngredient } from '../models';
import { Op } from 'sequelize';

class OrderController {
  static async getLatestOrderStatus(orderId: number): Promise<number> {
    const latestHistory = await OrderStatusHistory.findOne({
      where: { order_id: orderId },
      order: [['created_at', 'DESC']]
    });
    return latestHistory ? latestHistory.status_id : 1;
  }

  static async getOrders(req: Request, res: Response) {
    try {
      const { start_date, end_date, customer_phone, order_number, customer_name, status } = req.query;
      const where: any = {};

      if (start_date) {
        where.service_date = { [Op.gte]: new Date(start_date as string) };
      }
      if (end_date) {
        where.service_date = { [Op.lte]: new Date(end_date as string) };
      }

      if (customer_phone) {
        where.customer_phone = { [Op.like]: `%${customer_phone}%` };
      }

      if (order_number) {
        where.order_number = { [Op.like]: `%${order_number}%` };
      }

      if (customer_name) {
        where.customer_name = { [Op.like]: `%${customer_name}%` };
      }

      if (status) {
        const statusValue = parseInt(status as string);
        if (statusValue === 2) {
          where.status = { [Op.gte]: 2 };
        } else {
          where.status = statusValue;
        }
      }

      const orders = await Order.findAll({
        where,
        order: [['id', 'DESC']],
        include: [{
          model: SetMeal, as: 'set_meal',
          include: [{ model: SetMealDish, as: 'set_meal_dishes', include: [{ model: Dish, as: 'dish' }] }]
        }, {
          model: OrderDish, as: 'order_dishes', include: [{ model: Dish, as: 'dish' }]
        }, {
          model: OrderStatus, as: 'order_status'
        }]
      });

      const ordersWithLatestStatus = await Promise.all(
        orders.map(async (order) => {
          const orderData = order.toJSON();
          const latestStatusId = await OrderController.getLatestOrderStatus(order.id);
          // 转换数值字段为数字类型
          const numericOrderData = {
            ...orderData,
            total_amount: parseFloat(orderData.total_amount) || 0,
            deposit: parseFloat(orderData.deposit) || 0,
            paid_amount: parseFloat(orderData.paid_amount) || 0,
            discount_amount: parseFloat(orderData.discount_amount) || 0,
            status: latestStatusId
          };
          return numericOrderData;
        })
      );

      res.json(ordersWithLatestStatus);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      res.status(500).json({ error: '获取订单列表失败' });
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      let { order_number, customer_name, customer_phone, customer_phone2, service_address, service_date, region, source, receiver_id, set_meal_id, feast_time, feast_type, booking_days, deposit, payment_method, remark, formal_tables, backup_tables, dishes, set_meal_price } = req.body;

      if (!order_number) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        order_number = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
      }

      let total_amount = 0;
      const totalTables = formal_tables + backup_tables;

      if (set_meal_price) {
        total_amount += parseFloat(set_meal_price.toString());
      } else if (set_meal_id) {
        const setMealInfo = await SetMeal.findByPk(set_meal_id);
        if (setMealInfo) {
          total_amount += parseFloat(setMealInfo.price.toString());
        }
      }

      total_amount *= totalTables;

      const user = (req as any).user;
      const username = user ? user.username : 'system';

      const order = await Order.create({
        order_number, customer_name, customer_phone, customer_phone2,
        service_address, service_date, region, source, receiver_id, set_meal_id,
        feast_time, feast_type, booking_days, deposit, paid_amount: deposit || 0,
        payment_method, remark, formal_tables, backup_tables, total_amount,
        status: 1, createdBy: username, updatedBy: username
      });

      await OrderStatusHistory.create({
        order_id: order.id, status_id: 1, created_by: username
      });

      if (dishes) {
        for (const dish of dishes) {
          await OrderDish.create({
            order_id: order.id, dish_id: dish.dish_id, quantity: dish.quantity
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error('创建订单失败:', error);
      res.status(500).json({ error: '创建订单失败' });
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [{
          model: SetMeal, as: 'set_meal',
          include: [{ model: SetMealDish, as: 'set_meal_dishes', include: [{ model: Dish, as: 'dish' }] }]
        }, {
          model: OrderDish, as: 'order_dishes', include: [{ model: Dish, as: 'dish' }]
        }, {
          model: OrderStatus, as: 'order_status'
        }]
      });
      if (order) {
        const orderData = order.toJSON();
        // 转换数值字段为数字类型
        const numericOrderData = {
          ...orderData,
          total_amount: parseFloat(orderData.total_amount) || 0,
          deposit: parseFloat(orderData.deposit) || 0,
          paid_amount: parseFloat(orderData.paid_amount) || 0,
          discount_amount: parseFloat(orderData.discount_amount) || 0
        };
        res.json(numericOrderData);
      } else {
        res.status(404).json({ error: '订单不存在' });
      }
    } catch (error) {
      console.error('获取订单详情失败:', error);
      res.status(500).json({ error: '获取订单详情失败' });
    }
  }

  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { order_number, customer_name, customer_phone, customer_phone2, service_address, service_date, region, source, receiver_id, set_meal_id, feast_time, feast_type, booking_days, deposit, payment_method, remark, formal_tables, backup_tables, status, dishes, set_meal_price } = req.body;

      const user = (req as any).user;
      const username = user ? user.username : 'system';

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      let total_amount = 0;
      const totalTables = (formal_tables || order.formal_tables) + (backup_tables || order.backup_tables);

      if (set_meal_price) {
        total_amount += parseFloat(set_meal_price.toString());
      } else {
        const mealId = set_meal_id || order.set_meal_id;
        if (mealId) {
          const setMealInfo = await SetMeal.findByPk(mealId);
          if (setMealInfo) {
            total_amount += parseFloat(setMealInfo.price.toString());
          }
        }
      }

      total_amount *= totalTables;

      const oldStatus = order.status;
      const newStatus = status || order.status;

      await order.update({
        order_number: order_number || order.order_number,
        customer_name: customer_name || order.customer_name,
        customer_phone: customer_phone || order.customer_phone,
        customer_phone2: customer_phone2 || order.customer_phone2,
        service_address: service_address || order.service_address,
        service_date: service_date || order.service_date,
        region: region || order.region,
        source: source || order.source,
        receiver_id: receiver_id !== undefined ? receiver_id : order.receiver_id,
        set_meal_id: set_meal_id || order.set_meal_id,
        feast_time: feast_time || order.feast_time,
        feast_type: feast_type || order.feast_type,
        booking_days: booking_days || order.booking_days,
        deposit: deposit || order.deposit,
        payment_method: payment_method || order.payment_method,
        remark: remark || order.remark,
        formal_tables: formal_tables || order.formal_tables,
        backup_tables: backup_tables || order.backup_tables,
        total_amount,
        status: newStatus,
        updatedBy: username
      });

      if (oldStatus !== newStatus) {
        await OrderStatusHistory.create({
          order_id: order.id, status_id: newStatus, created_by: username
        });
      }

      if (dishes) {
        await OrderDish.destroy({ where: { order_id: id } });
        for (const dish of dishes) {
          await OrderDish.create({
            order_id: order.id, dish_id: dish.dish_id, quantity: dish.quantity
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error('更新订单失败:', error);
      res.status(500).json({ error: '更新订单失败' });
    }
  }

  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      await OrderDish.destroy({ where: { order_id: id } });
      await OrderStaffArrangement.destroy({ where: { order_id: id } });
      await order.destroy();

      res.json({ message: '订单删除成功' });
    } catch (error) {
      console.error('删除订单失败:', error);
      res.status(500).json({ error: '删除订单失败' });
    }
  }

  static async saveStaffArrangement(req: Request, res: Response) {
    try {
      const { order_id, chefs, waiters, drivers, vehicles, externalDrivers, departure_time, arrival_time, remark } = req.body;

      const user = (req as any).user;
      const username = user ? user.username : 'system';

      let arrangement = await OrderStaffArrangement.findOne({ where: { order_id } });

      if (arrangement) {
        await arrangement.update({
          chefs: JSON.stringify(chefs),
          waiters: JSON.stringify(waiters),
          drivers: JSON.stringify(drivers),
          vehicles: JSON.stringify(vehicles),
          externalDrivers: JSON.stringify(externalDrivers),
          departure_time, arrival_time, remark, updatedBy: username
        });
      } else {
        arrangement = await OrderStaffArrangement.create({
          order_id,
          chefs: JSON.stringify(chefs),
          waiters: JSON.stringify(waiters),
          drivers: JSON.stringify(drivers),
          vehicles: JSON.stringify(vehicles),
          externalDrivers: JSON.stringify(externalDrivers),
          departure_time, arrival_time, remark,
          createdBy: username, updatedBy: username
        });
      }

      const order = await Order.findByPk(order_id);
      if (order && order.status !== 2) {
        await order.update({ status: 2, updatedBy: username });
        await OrderStatusHistory.create({
          order_id: order.id, status_id: 2, created_by: username
        });
      }

      res.json(arrangement);
    } catch (error) {
      console.error('保存人员安排失败:', error);
      res.status(500).json({ error: '保存人员安排失败' });
    }
  }

  static async getStaffArrangement(req: Request, res: Response) {
    try {
      const { order_id } = req.params;
      const arrangement = await OrderStaffArrangement.findOne({ where: { order_id } });

      if (arrangement) {
        const result = {
          ...arrangement.toJSON(),
          chefs: JSON.parse(arrangement.chefs),
          waiters: JSON.parse(arrangement.waiters),
          drivers: JSON.parse(arrangement.drivers),
          vehicles: JSON.parse(arrangement.vehicles),
          externalDrivers: arrangement.externalDrivers ? JSON.parse(arrangement.externalDrivers) : []
        };
        res.json(result);
      } else {
        res.status(404).json({ error: '人员安排不存在' });
      }
    } catch (error) {
      console.error('获取人员安排失败:', error);
      res.status(500).json({ error: '获取人员安排失败' });
    }
  }

  static async getOrderStatuses(req: Request, res: Response) {
    try {
      const statuses = await OrderStatus.findAll();
      res.json(statuses);
    } catch (error) {
      console.error('获取订单状态列表失败:', error);
      res.status(500).json({ error: '获取订单状态列表失败' });
    }
  }

  static async getOrderStatusHistory(req: Request, res: Response) {
    try {
      const { order_id } = req.params;
      const history = await OrderStatusHistory.findAll({
        where: { order_id },
        order: [['created_at', 'DESC']]
      });

      const historyWithStatus = await Promise.all(
        history.map(async (record) => {
          const status = await OrderStatus.findByPk(record.status_id);
          return { ...record.toJSON(), order_status: status };
        })
      );

      res.json(historyWithStatus);
    } catch (error) {
      console.error('获取订单状态历史失败:', error);
      res.status(500).json({ error: '获取订单状态历史失败' });
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { order_id } = req.params;
      const { status_id } = req.body;

      const user = (req as any).user;
      const username = user ? user.username : 'system';

      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      if (order.status === status_id) {
        return res.json({ message: '状态未变更' });
      }

      await order.update({ status: status_id, updatedBy: username });
      await OrderStatusHistory.create({
        order_id: order.id, status_id: status_id, created_by: username
      });

      res.json(order);
    } catch (error) {
      console.error('更新订单状态失败:', error);
      res.status(500).json({ error: '更新订单状态失败' });
    }
  }

  static async confirmPayment(req: Request, res: Response) {
    try {
      const { order_id } = req.params;
      const { payment_amount, discount_amount } = req.body;
      console.log('确认回款:', order_id, payment_amount, discount_amount);

      const user = (req as any).user;
      const username = user ? user.username : 'system';

      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      const previousPaid = parseFloat(order.paid_amount.toString()) || 0;
      const previousDiscount = parseFloat(order.discount_amount.toString()) || 0;
      const paid = parseFloat(payment_amount) || 0;
      const discount = parseFloat(discount_amount) || 0;
      const totalPaid = previousPaid + paid;
      const totalDiscount = previousDiscount + discount;

      await order.update({
        paid_amount: totalPaid, discount_amount: totalDiscount, updatedBy: username
      });

      const deposit = parseFloat(order.deposit.toString()) || 0;
      const totalAmount = parseFloat(order.total_amount.toString());
      const receivable = totalAmount - deposit - totalPaid - totalDiscount;

      if (receivable <= 0 && order.status !== 9) {
        await order.update({ status: 9, updatedBy: username });
        await OrderStatusHistory.create({
          order_id: order.id, status_id: 9, created_by: username
        });
      }

      res.json(order);
    } catch (error) {
      console.error('回款确认失败:', error);
      res.status(500).json({ error: '回款确认失败' });
    }
  }

  static async getOrderDishes(req: Request, res: Response) {
    try {
      const { order_id } = req.params;

      const order = await Order.findByPk(order_id, {
        include: [{
          model: SetMeal, as: 'set_meal',
          include: [{ model: SetMealDish, as: 'set_meal_dishes', include: [{ model: Dish, as: 'dish' }] }]
        }, {
          model: OrderDish, as: 'order_dishes', include: [{ model: Dish, as: 'dish' }]
        }]
      });

      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      const dishes: any[] = [];
      const allIngredients: any[] = [];
      const dishIdSet = new Set();

      if ((order as any).order_dishes) {
        for (const orderDish of (order as any).order_dishes) {
          const dish = orderDish.dish;
          if (dish && !dishIdSet.has(dish.id)) {
            dishIdSet.add(dish.id);
            dishes.push({
              id: dish.id, name: dish.name,
              cookingDescription: dish.cookingDescription,
              cookingMethod: dish.cookingMethod,
              dishware: dish.dishware
            });
          }
        }
      }

      try {
        const orderDishIds: number[] = [];
        if ((order as any).order_dishes) {
          for (const orderDish of (order as any).order_dishes) {
            if (orderDish.dish) {
              orderDishIds.push(orderDish.dish.id);
            }
          }
        }

        if (orderDishIds.length > 0) {
          const dishIngredients = await DishIngredient.findAll({
            where: { dish_id: orderDishIds }
          });

          const ingredientIds = [...new Set(dishIngredients.map(di => di.ingredient_id))];
          const ingredients = await Ingredient.findAll({
            where: { id: ingredientIds }
          });

          const ingredientMap = new Map(ingredients.map(ing => [ing.id, ing]));
          const totalTables = order.formal_tables + order.backup_tables;
          const ingredientAccumulator = new Map<string, any>();

          if ((order as any).order_dishes) {
            for (const orderDish of (order as any).order_dishes) {
              const dishId = orderDish.dish ? orderDish.dish.id : null;
              const orderDishQuantity = orderDish.quantity || 1;

              if (dishId) {
                const dishIngRecords = dishIngredients.filter(di => di.dish_id === dishId);
                for (const di of dishIngRecords) {
                  const ingredient = ingredientMap.get(di.ingredient_id);
                  if (ingredient) {
                    const dishIngQuantity = di.quantity || 1;
                    const totalIngQuantity = orderDishQuantity * dishIngQuantity;
                    const key = `${ingredient.name}_${ingredient.unit}`;

                    if (ingredientAccumulator.has(key)) {
                      const existing = ingredientAccumulator.get(key);
                      existing.perTable += totalIngQuantity;
                      existing.totalQuantity += totalIngQuantity * totalTables;
                    } else {
                      ingredientAccumulator.set(key, {
                        id: ingredient.id, name: ingredient.name,
                        unit: ingredient.unit, perTable: totalIngQuantity,
                        totalQuantity: totalIngQuantity * totalTables,
                        category: ingredient.category
                      });
                    }
                  }
                }
              }
            }
          }
          allIngredients.push(...Array.from(ingredientAccumulator.values()));
        }
      } catch (e) {
        console.error('获取店铺食材失败:', e);
      }

      res.json({ dishes, ingredients: allIngredients });
    } catch (error) {
      console.error('获取订单菜品失败:', error);
      res.status(500).json({ error: '获取订单菜品失败' });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const username = user ? user.username : 'system';

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: '订单不存在' });
      }

      const latestStatusId = await OrderController.getLatestOrderStatus(order.id);
      if (latestStatusId === -1) {
        return res.status(400).json({ error: '该订单已退订' });
      }

      await OrderStatusHistory.create({
        order_id: order.id,
        status_id: -1,
        created_by: username
      });

      res.json({ message: '订单退订成功' });
    } catch (error) {
      console.error('订单退订失败:', error);
      res.status(500).json({ error: '订单退订失败' });
    }
  }
}


export default OrderController;

