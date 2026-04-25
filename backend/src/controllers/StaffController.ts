import { Request, Response } from 'express';
import { Staff } from '../models';

class StaffController {
  static async getStaffList(req: Request, res: Response) {
    try {
<<<<<<< HEAD
      const staffList = await Staff.findAll({
        order: [['created_at', 'DESC']]
      });
      res.json(staffList);
    } catch (error) {
      console.error('获取人员列表失败:', error);
=======
      const staff = await Staff.findAll({ order: [['created_at', 'DESC']] });
      res.json(staff);
    } catch (error) {
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '获取人员列表失败' });
    }
  }

  static async createStaff(req: Request, res: Response) {
    try {
      const { name, gender, age, phone, position, positionType, registrationTime } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const staff = await Staff.create({
        name,
        gender,
        age,
        phone,
        position,
        positionType,
        registrationTime,
        createdBy: username,
        updatedBy: username
      });
      res.json(staff);
    } catch (error) {
<<<<<<< HEAD
      console.error('创建人员失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '创建人员失败' });
    }
  }

  static async getStaffById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const staff = await Staff.findByPk(id);
      if (staff) {
        res.json(staff);
      } else {
        res.status(404).json({ error: '人员不存在' });
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('获取人员详情失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '获取人员详情失败' });
    }
  }

  static async updateStaff(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, gender, age, phone, position, positionType, registrationTime } = req.body;
      const user = (req as any).user;
      const username = user ? user.username : 'system';
      const staff = await Staff.findByPk(id);
      if (!staff) {
        return res.status(404).json({ error: '人员不存在' });
      }
      await staff.update({
        name: name || staff.name,
        gender: gender || staff.gender,
        age: age || staff.age,
        phone: phone || staff.phone,
        position: position || staff.position,
        positionType: positionType || staff.positionType,
        registrationTime: registrationTime || staff.registrationTime,
        updatedBy: username
      });
      res.json(staff);
    } catch (error) {
<<<<<<< HEAD
      console.error('更新人员失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '更新人员失败' });
    }
  }

  static async deleteStaff(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const staff = await Staff.findByPk(id);
      if (!staff) {
        return res.status(404).json({ error: '人员不存在' });
      }
      await staff.destroy();
      res.json({ message: '删除人员成功' });
    } catch (error) {
<<<<<<< HEAD
      console.error('删除人员失败:', error);
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '删除人员失败' });
    }
  }
}

export default StaffController;