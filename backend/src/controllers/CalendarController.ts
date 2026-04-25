import { Request, Response } from 'express';
import { Order } from '../models';
import { Op } from 'sequelize';

class CalendarController {

  static async getOrderCalendar(req: Request, res: Response) {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      const orders = await Order.findAll({
        where: {
          service_date: {
            [Op.between]: [formatDate(startDate), formatDate(endDate)]
          }
        }
      });

      const calendarData: any = {};
      orders.forEach(order => {
        const dateStr = String((order as any).service_date);
        if (!calendarData[dateStr]) {
          calendarData[dateStr] = [];
        }

        calendarData[dateStr].push({
          id: (order as any).id,
          customer_name: (order as any).customer_name,
          customer_phone: (order as any).customer_phone,
          table_count: (order as any).formal_tables + (order as any).backup_tables,
          total_amount: (order as any).total_amount,
          status: (order as any).status
        });
      });

      res.json(calendarData);
    } catch (error) {
      res.status(500).json({ error: '获取订单日历失败' });

    }
  }
}

export default CalendarController;