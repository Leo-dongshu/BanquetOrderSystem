import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';

class UserController {
  // 获取用户列表
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: '获取用户列表失败' });
    }
  }

  // 创建新用户
  static async createUser(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      
      // 检查用户是否已存在
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: '用户名已存在' });
      }
      
      // 加密密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // 创建用户
      const user = await User.create({
        username,
        password: hashedPassword,
        role: role || 'user'
      });
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: '创建用户失败' });
    }
  }

  // 获取用户详情
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: '用户不存在' });
      }
    } catch (error) {
      res.status(500).json({ error: '获取用户详情失败' });
    }
  }

  // 更新用户
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      // 更新用户信息
      const updateData: any = {}
      if (username) updateData.username = username;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
      if (role) updateData.role = role;
      
      await user.update(updateData);
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: '更新用户失败' });
    }
  }

  // 删除用户
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      await user.destroy();
      res.json({ message: '用户删除成功' });
    } catch (error) {
      res.status(500).json({ error: '删除用户失败' });
    }
  }
}

export default UserController;