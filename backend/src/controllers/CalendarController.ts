import { Request, Response } from 'express';
import { Order } from '../models';
import { Op } from 'sequelize';

class CalendarController {
  // 获取日历数据
  static async getCalendarData(req: Request, res: Response) {
    try {
      const { year, month } = req.query;
      
      if (!year || !month) {
        return res.status(400).json({ error: '缺少年份或月份参数' });
      }
      
      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
      
      const orders = await Order.findAll({
        where: {
          service_date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      
      // 按日期分组
      const dateMap = new Map();
      orders.forEach(order => {
        const date = order.service_date.toISOString().split('T')[0];
        const existing = dateMap.get(date) || {
          date,
          confirmed: 0,
          pending: 0
        };
        
        if (order.status === 'confirmed') {
          existing.confirmed++;
        } else if (order.status === 'pending') {
          existing.pending++;
        }
        
        dateMap.set(date, existing);
      });
      
      res.json(Array.from(dateMap.values()));
    } catch (error) {
      res.status(500).json({ error: '获取日历数据失败' });
    }
  }
}

export default CalendarController;