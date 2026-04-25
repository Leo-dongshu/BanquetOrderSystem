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
      let totalOrders = orders.length;
      let totalAmount = 0;
      let pendingArrange = 0;
      let pendingPayment = 0;
      let completed = 0;
      orders.forEach(order => {
        totalAmount += Number((order as any).total_amount) || 0;
        if ((order as any).status === 1) pendingArrange++;
        if ((order as any).status === 3) pendingPayment++;
        if ((order as any).status === 9) completed++;
      });
      res.json({ totalOrders, totalAmount, pendingArrange, pendingPayment, completed });
    } catch (error) {
      res.status(500).json({ error: '获取仪表板统计失败' });

    }
  }
}

export default StatsController;