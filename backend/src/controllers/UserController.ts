import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';

class UserController {

  static async getUsers(req: Request, res: Response) {
    try {

      const users = await User.findAll({
        attributes: ['id', 'username', 'role', 'created_at', 'updated_at']
      });
      res.json(users);
    } catch (error) {

      res.status(500).json({ error: '获取用户列表失败' });
    }
  }


  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (user && user.role !== 'admin' && user.id !== parseInt(id)) {
        return res.status(403).json({ error: '没有权限查看用户详情' });
      }
      const targetUser = await User.findByPk(id, {
        attributes: ['id', 'username', 'role', 'created_at', 'updated_at']
      });
      if (!targetUser) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json(targetUser);
    } catch (error) {
      res.status(500).json({ error: '获取用户详情失败' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: '用户名已存在' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: role || 'user'
      });


      res.json({ 
        message: '用户创建成功', 
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        }
      });
    } catch (error) {

      res.status(500).json({ error: '创建用户失败' });
    }
  }


  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      const user = (req as any).user;

      if (user && user.role !== 'admin' && user.id !== parseInt(id)) {
        return res.status(403).json({ error: '没有权限更新用户信息' });
      }

      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        return res.status(404).json({ error: '用户不存在' });
      }


      if (username && username !== targetUser.username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(400).json({ error: '用户名已存在' });
        }
      }


      const updateData: any = {};
      if (username) updateData.username = username;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      if (role && user && user.role === 'admin') updateData.role = role;
      await targetUser.update(updateData);

      res.json({ 
        message: '用户更新成功', 
        user: {
          id: targetUser.id,
          username: targetUser.username,
          role: targetUser.role,
          created_at: targetUser.created_at,
          updated_at: targetUser.updated_at
        }
      });
    } catch (error) {

      res.status(500).json({ error: '更新用户失败' });
    }
  }


  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;


      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        return res.status(404).json({ error: '用户不存在' });
      }

      if (user && user.id === targetUser.id) {
        return res.status(400).json({ error: '不能删除自己' });
      }
      await targetUser.destroy();
      res.json({ message: '用户删除成功' });
    } catch (error) {

      res.status(500).json({ error: '删除用户失败' });
    }
  }
}

export default UserController;