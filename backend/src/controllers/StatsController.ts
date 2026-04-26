import { Request, Response } from 'express';

import { Order } from '../models';
import { Op } from 'sequelize';

class StatsController {
  static async getIngredientStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;

      const dateCondition = {};
      if (start_date) {
        Object.assign(dateCondition, { [Op.gte]: start_date });
      }
      if (end_date) {
        Object.assign(dateCondition, { [Op.lte]: end_date });
      }

      const orders = await Order.findAll({
        where: {
          service_date: dateCondition
        }
      });
      const result: any[] = [];
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '获取食材统计失败' });
    }
  }

  static async getOrderStats(req: Request, res: Response) {
    try {
      const { start_date, end_date } = req.query;

      const dateCondition = {};
      if (start_date) {
        Object.assign(dateCondition, { [Op.gte]: start_date });
      }
      if (end_date) {
        Object.assign(dateCondition, { [Op.lte]: end_date });
      }

      const orders = await Order.findAll({ where: { service_date: dateCondition } });
      let totalOrders = 0;
      let totalAmount = 0;
      let totalTables = 0;
      const statusCount: { [key: string | number]: number } = {};
      orders.forEach(order => {
        totalOrders++;
        totalAmount += Number((order as any).total_amount) || 0;
        totalTables += (order as any).formal_tables + (order as any).backup_tables;
        const status = (order as any).status;
        if (statusCount[status]) {
          statusCount[status]++;
        } else {
          statusCount[status] = 1;
        }
      });
      res.json({ totalOrders, totalAmount, totalTables, statusCount });
    } catch (error) {
      res.status(500).json({ error: '获取订单统计失败' });
    }
  }

  static async getDashboardStats(req: Request, res: Response) {
    try {
      const orders = await Order.findAll();
      
      // 获取当前月份的订单
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      let total_orders = 0;
      let total_amount = 0;
      let monthly_amount = 0;
      let total_discount = 0;
      let monthly_discount = 0;
      let total_revenue = 0;
      let monthly_revenue = 0;
      let pending_payment = 0;
      let monthly_pending_payment = 0;
      let total_tables = 0;
      let pending_arrange = 0;
      let arranged = 0;
      let pending_payment_count = 0;
      let completed = 0;
      let cancelled = 0;
      
      orders.forEach(order => {
        const orderData = order as any;
        total_orders++;
        
        const orderAmount = Number(orderData.total_amount) || 0;
        const orderDiscount = Number(orderData.discount_amount) || 0;
        const orderDeposit = Number(orderData.deposit) || 0;
        const orderPayment = Number(orderData.paid_amount) || 0;
        
        total_amount += orderAmount;
        total_discount += orderDiscount;
        total_revenue += (orderPayment + orderDeposit); // 已收款金额 = 已回款 + 预付定金
        
        total_tables += (orderData.formal_tables || 0) + (orderData.backup_tables || 0);
        
        // 检查订单是否在本月
        const serviceDate = new Date(orderData.service_date);
        const isCurrentMonth = serviceDate >= currentMonthStart && serviceDate <= currentMonthEnd;
        
        if (isCurrentMonth) {
          monthly_amount += orderAmount;
          monthly_discount += orderDiscount;
          monthly_revenue += (orderPayment + orderDeposit); // 本月已收款 = 本月已回款 + 本月预付定金
        }
        
        // 计算待回款金额：订单总价 - 预付定金 - 已回款 - 优惠金额
        const orderPendingPayment = Math.max(0, orderAmount - orderDeposit - orderPayment - orderDiscount);
        
        // 根据状态统计
        if (orderData.status === 1) {
          pending_arrange++;
          // 待安排的订单也计入待回款
          pending_payment += orderPendingPayment;
          if (isCurrentMonth) {
            monthly_pending_payment += orderPendingPayment;
          }
        } else if (orderData.status === 2) {
          arranged++;
          // 已安排的订单也计入待回款
          pending_payment += orderPendingPayment;
          if (isCurrentMonth) {
            monthly_pending_payment += orderPendingPayment;
          }
        } else if (orderData.status === 3) {
          pending_payment_count++;
          // 待回款状态的订单计入待回款
          pending_payment += orderPendingPayment;
          if (isCurrentMonth) {
            monthly_pending_payment += orderPendingPayment;
          }
        } else if (orderData.status === 9) {
          completed++;
        } else if (orderData.status === 0) {
          cancelled++;
        }
      });
      
      res.json({
        total_orders,
        total_amount,
        monthly_amount,
        total_discount,
        monthly_discount,
        total_revenue,
        monthly_revenue,
        pending_payment,
        monthly_pending_payment,
        total_tables,
        pending_arrange,
        arranged,
        pending_payment_count,
        completed,
        cancelled
      });
    } catch (error) {
      console.error('获取仪表板统计失败:', error);
      res.status(500).json({ error: '获取仪表板统计失败' });
    }
  }
}

export default StatsController;