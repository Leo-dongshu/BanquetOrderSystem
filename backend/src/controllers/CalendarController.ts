import { Request, Response } from 'express';
import { Order } from '../models';
import { Op } from 'sequelize';

class CalendarController {
<<<<<<< HEAD
  // 获取订单日历数据
  static async getOrderCalendar(req: Request, res: Response) {
    try {
      console.log('开始获取订单日历数据');
      // 计算未来1个月的日期范围
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      // 格式化日期为YYYY-MM-DD格式
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      console.log('查询日期范围:', formatDate(startDate), '到', formatDate(endDate));

      // 查询未来1个月的订单
=======
  static async getOrderCalendar(req: Request, res: Response) {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const orders = await Order.findAll({
        where: {
          service_date: {
            [Op.between]: [formatDate(startDate), formatDate(endDate)]
          }
        }
      });
<<<<<<< HEAD

      console.log('查询到的订单数量:', orders.length);

      // 构建日历数据
      const calendarData: any = {};

      orders.forEach(order => {
        // 直接使用service_date作为键，因为它已经是YYYY-MM-DD格式的字符串
        const dateStr = (order as any).service_date;
        console.log('订单日期:', dateStr);
        if (!calendarData[dateStr]) {
          calendarData[dateStr] = [];
        }

=======
      const calendarData: any = {};
      orders.forEach(order => {
        const dateStr = String((order as any).service_date);
        if (!calendarData[dateStr]) {
          calendarData[dateStr] = [];
        }
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
        calendarData[dateStr].push({
          id: (order as any).id,
          customer_name: (order as any).customer_name,
          customer_phone: (order as any).customer_phone,
          table_count: (order as any).formal_tables + (order as any).backup_tables,
          total_amount: (order as any).total_amount,
          status: (order as any).status
        });
      });
<<<<<<< HEAD

      console.log('构建的日历数据:', calendarData);

      res.json(calendarData);
    } catch (error) {
      console.error('获取订单日历数据失败:', error);
      res.status(500).json({ error: '获取订单日历数据失败' });
=======
      res.json(calendarData);
    } catch (error) {
      res.status(500).json({ error: '获取订单日历失败' });
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
    }
  }
}

export default CalendarController;