import { Request, Response } from 'express';
import { Order, OrderDish, Dish, DishIngredient, Ingredient, OrderSetMeal, SetMeal, SetMealDish } from '../models';
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';

class StatsController {
  // 统计食材需求
  static async getIngredientStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      console.log('开始统计食材需求:', { start_date, end_date });

      // 构建日期查询条件
      const dateCondition = {};
      if (start_date) {
        Object.assign(dateCondition, { [Op.gte]: start_date });
      }
      if (end_date) {
        Object.assign(dateCondition, { [Op.lte]: end_date });
      }

      // 查询指定日期范围内的订单，只包含已确认的订单
      const orders = await Order.findAll({
        where: {
          service_date: dateCondition,
          status: 'confirmed'
        },
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

      console.log('查询到的订单数量:', orders.length);

      // 计算食材需求
      const ingredientStats: any = {};

      orders.forEach(order => {
        console.log('处理订单:', order.id);
        const orderDishes = (order as any).order_dishes || [];
        console.log('订单菜品数量:', orderDishes.length);
        
        // 处理直接点的菜品
        orderDishes.forEach((orderDish: any) => {
          const dish = orderDish.dish;
          if (!dish) return;
          
          const quantity = orderDish.quantity;
          const dishIngredients = dish.dish_ingredients || [];
          console.log('菜品用料数量:', dishIngredients.length);

          dishIngredients.forEach((dishIngredient: any) => {
            const ingredient = dishIngredient.ingredient;
            if (!ingredient) return;
            
            const ingredientId = ingredient.id;
            const ingredientName = ingredient.name;
            // 总需求量计算公式：桌数 * 订单菜品中的数量 * 单位克 * 用量
            const unitValue = parseFloat(ingredient.unit.toString()) || 1; // 从数据库中获取单位值
            const usage = parseFloat(dishIngredient.quantity.toString()); // 用量
            const totalTables = order.formal_tables + order.backup_tables;
            const ingredientQuantity = totalTables * quantity * unitValue * usage;

            if (!ingredientStats[ingredientId]) {
              ingredientStats[ingredientId] = {
                id: ingredientId,
                name: ingredientName,
                category: ingredient.category,
                total_quantity: 0
              };
            }

            ingredientStats[ingredientId].total_quantity += ingredientQuantity;
          });
        });

        // 处理套餐中的菜品
        const orderSetMeals = (order as any).order_set_meals || [];
        console.log('订单套餐数量:', orderSetMeals.length);
        
        orderSetMeals.forEach((orderSetMeal: any) => {
          const setMeal = orderSetMeal.set_meal;
          if (!setMeal) return;
          
          const setMealDishes = setMeal.set_meal_dishes || [];
          console.log('套餐菜品数量:', setMealDishes.length);
          
          setMealDishes.forEach((setMealDish: any) => {
            const dish = setMealDish.dish;
            if (!dish) return;
            
            // 套餐中的菜品默认数量为1
            const quantity = 1;
            const dishIngredients = dish.dish_ingredients || [];
            console.log('套餐菜品用料数量:', dishIngredients.length);

            dishIngredients.forEach((dishIngredient: any) => {
              const ingredient = dishIngredient.ingredient;
              if (!ingredient) return;
              
              const ingredientId = ingredient.id;
              const ingredientName = ingredient.name;
              // 总需求量计算公式：桌数 * 套餐菜品数量 * 单位克 * 用量
              const unitValue = parseFloat(ingredient.unit.toString()) || 1; // 从数据库中获取单位值
              const usage = parseFloat(dishIngredient.quantity.toString()); // 用量
              const totalTables = order.formal_tables + order.backup_tables;
              const ingredientQuantity = totalTables * quantity * unitValue * usage;

              if (!ingredientStats[ingredientId]) {
                ingredientStats[ingredientId] = {
                  id: ingredientId,
                  name: ingredientName,
                  category: ingredient.category,
                  total_quantity: 0
                };
              }

              ingredientStats[ingredientId].total_quantity += ingredientQuantity;
            });
          });
        });
      });

      // 转换为数组格式
      const result = Object.values(ingredientStats);
      console.log('统计结果:', result);
      res.json(result);
    } catch (error) {
      console.error('统计食材需求失败:', error);
      res.status(500).json({ error: '统计食材需求失败' });
    }
  }

  // 统计订单数据
  static async getOrderStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;

      // 构建日期查询条件
      const dateCondition = {};
      if (start_date) {
        Object.assign(dateCondition, { [Op.gte]: start_date });
      }
      if (end_date) {
        Object.assign(dateCondition, { [Op.lte]: end_date });
      }

      // 查询订单数据
      const orders = await Order.findAll({
        where: {
          service_date: dateCondition
        }
      });

      // 计算统计数据
      let totalOrders = orders.length;
      let totalAmount = 0;
      let totalTableCount = 0;
      const statusCount: any = {};

      orders.forEach(order => {
        totalAmount += parseFloat((order as any).total_amount.toString());
        totalTableCount += (order as any).formal_tables + (order as any).backup_tables;
        
        const status = (order as any).status;
        if (!statusCount[status]) {
          statusCount[status] = 0;
        }
        statusCount[status]++;
      });

      const result = {
        total_orders: totalOrders,
        total_amount: totalAmount,
        table_count: totalTableCount,
        status_count: statusCount
      };

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '统计订单数据失败' });
    }
  }

  // 首页仪表盘统计
  static async getDashboardStats(req: Request, res: Response) {
    try {
      // 获取所有订单
      const allOrders = await Order.findAll();
      
      // 计算总收入（已完成订单）
      let totalRevenue = 0;
      let totalOrders = allOrders.length;
      let totalTables = 0;
      const statusCount: Record<number, number> = {
        '-1': 0, // 已取消
        '1': 0,  // 待安排
        '2': 0,  // 已安排
        '3': 0,  // 待回款
        '9': 0   // 已完成
      };

      allOrders.forEach(order => {
        const status = order.status;
        if (!statusCount[status]) {
          statusCount[status] = 0;
        }
        statusCount[status]++;
        
        totalTables += order.formal_tables + order.backup_tables;
        
        // 已完成订单计算收入
        if (status === 9) {
          totalRevenue += parseFloat(order.total_amount.toString());
        }
      });

      // 获取所有订单的总金额、本月金额和优惠金额
      let totalAmount = 0;
      let monthlyAmount = 0;
      let totalDiscount = 0;
      let monthlyDiscount = 0;
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      allOrders.forEach(order => {
        const amount = parseFloat(order.total_amount.toString());
        totalAmount += amount;
        
        const discount = parseFloat((order as any).discount_amount?.toString() || '0');
        totalDiscount += discount;
        
        const orderDate = new Date(order.service_date);
        if (orderDate >= firstDayOfMonth) {
          monthlyAmount += amount;
          monthlyDiscount += discount;
        }
      });

      // 计算本月已完成收入（保留原逻辑）
      let monthlyRevenue = 0;
      
      allOrders.forEach(order => {
        if (order.status === 9) {
          const orderDate = new Date(order.created_at);
          if (orderDate >= firstDayOfMonth) {
            monthlyRevenue += parseFloat(order.total_amount.toString());
          }
        }
      });

      // 计算待回款金额
      let pendingPayment = 0;
      let monthlyPendingPayment = 0;
      allOrders.forEach(order => {
        const total = parseFloat(order.total_amount.toString());
        const paid = parseFloat(order.paid_amount?.toString() || '0');
        const pending = total - paid;
        
        if (order.status !== 9) {
          pendingPayment += pending;
          
          const orderDate = new Date(order.service_date);
          if (orderDate >= firstDayOfMonth) {
            monthlyPendingPayment += pending;
          }
        }
      });

      const result = {
        total_orders: totalOrders,
        total_amount: totalAmount,
        monthly_amount: monthlyAmount,
        total_discount: totalDiscount,
        monthly_discount: monthlyDiscount,
        monthly_revenue: monthlyRevenue,
        pending_payment: pendingPayment,
        monthly_pending_payment: monthlyPendingPayment,
        total_tables: totalTables,
        pending_arrange: statusCount[1] || 0,
        arranged: statusCount[2] || 0,
        pending_payment_count: statusCount[3] || 0,
        completed: statusCount[9] || 0,
        cancelled: statusCount[-1] || 0
      };

      res.json(result);
    } catch (error) {
      console.error('获取仪表盘统计数据失败:', error);
      res.status(500).json({ error: '获取仪表盘统计数据失败' });
    }
  }

  // 导出食材需求到Excel
  static async exportIngredientStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;
      console.log('开始导出食材需求:', { start_date, end_date });

      // 构建日期查询条件
      const dateCondition = {};
      if (start_date) {
        Object.assign(dateCondition, { [Op.gte]: start_date });
      }
      if (end_date) {
        Object.assign(dateCondition, { [Op.lte]: end_date });
      }

      // 查询指定日期范围内的订单，只包含已确认的订单
      const orders = await Order.findAll({
        where: {
          service_date: dateCondition,
          status: 'confirmed'
        },
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
      const ingredientStats: any = {};

      orders.forEach(order => {
        const orderDishes = (order as any).order_dishes || [];
        
        // 处理直接点的菜品
        orderDishes.forEach((orderDish: any) => {
          const dish = orderDish.dish;
          if (!dish) return;
          
          const quantity = orderDish.quantity;
          const dishIngredients = dish.dish_ingredients || [];

          dishIngredients.forEach((dishIngredient: any) => {
            const ingredient = dishIngredient.ingredient;
            if (!ingredient) return;
            
            const ingredientId = ingredient.id;
            const ingredientName = ingredient.name;
            // 总需求量计算公式：桌数 * 订单菜品中的数量 * 单位克 * 用量
            const unitValue = parseFloat(ingredient.unit.toString()) || 1; // 从数据库中获取单位值
            const usage = parseFloat(dishIngredient.quantity.toString()); // 用量
            const totalTables = order.formal_tables + order.backup_tables;
            const ingredientQuantity = totalTables * quantity * unitValue * usage;

            if (!ingredientStats[ingredientId]) {
              ingredientStats[ingredientId] = {
                id: ingredientId,
                name: ingredientName,
                category: ingredient.category,
                total_quantity: 0
              };
            }

            ingredientStats[ingredientId].total_quantity += ingredientQuantity;
          });
        });

        // 处理套餐中的菜品
        const orderSetMeals = (order as any).order_set_meals || [];
        
        orderSetMeals.forEach((orderSetMeal: any) => {
          const setMeal = orderSetMeal.set_meal;
          if (!setMeal) return;
          
          const setMealDishes = setMeal.set_meal_dishes || [];
          
          setMealDishes.forEach((setMealDish: any) => {
            const dish = setMealDish.dish;
            if (!dish) return;
            
            // 套餐中的菜品默认数量为1
            const quantity = 1;
            const dishIngredients = dish.dish_ingredients || [];

            dishIngredients.forEach((dishIngredient: any) => {
              const ingredient = dishIngredient.ingredient;
              if (!ingredient) return;
              
              const ingredientId = ingredient.id;
              const ingredientName = ingredient.name;
              // 总需求量计算公式：桌数 * 套餐菜品数量 * 单位克 * 用量
              const unitValue = parseFloat(ingredient.unit.toString()) || 1; // 从数据库中获取单位值
              const usage = parseFloat(dishIngredient.quantity.toString()); // 用量
              const totalTables = order.formal_tables + order.backup_tables;
              const ingredientQuantity = totalTables * quantity * unitValue * usage;

              if (!ingredientStats[ingredientId]) {
                ingredientStats[ingredientId] = {
                  id: ingredientId,
                  name: ingredientName,
                  category: ingredient.category,
                  total_quantity: 0
                };
              }

              ingredientStats[ingredientId].total_quantity += ingredientQuantity;
            });
          });
        });
      });

      // 转换为数组格式
      const result = Object.values(ingredientStats) as Array<{id: number; name: string; category: string; total_quantity: number}>;
      
      // 准备Excel数据
      const excelData = result.map(item => ({
        '用料分类': item.category,
        '用料名称': item.name,
        '总量(克)': item.total_quantity
      }));

      // 创建工作簿和工作表
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, '食材需求');

      // 生成文件名
      const startStr = start_date || '';
      const endStr = end_date || '';
      const filename = `食材清单_${startStr}_${endStr}.xlsx`;

      // 设置响应头
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);

      // 发送Excel文件
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      res.send(excelBuffer);
    } catch (error) {
      console.error('导出食材需求失败:', error);
      res.status(500).json({ error: '导出食材需求失败' });
    }
  }
}

export default StatsController;