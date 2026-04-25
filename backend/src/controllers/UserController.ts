import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';

class UserController {
<<<<<<< HEAD
  // 获取用户列表
  static async getUsers(req: Request, res: Response) {
    try {
      // 检查用户权限，只有管理员可以查看用户列表
      const user = (req as any).user;
      if (user && user.role !== 'admin') {
        return res.status(403).json({ error: '没有权限查看用户列表' });
      }
      
=======
  static async getUsers(req: Request, res: Response) {
    try {
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const users = await User.findAll({
        attributes: ['id', 'username', 'role', 'created_at', 'updated_at']
      });
      res.json(users);
    } catch (error) {
<<<<<<< HEAD
      console.error('获取用户列表失败:', error);
      res.status(500).json({ error: '获取用户列表失败' });
    }
  }
  
  // 获取用户详情
=======
      res.status(500).json({ error: '获取用户列表失败' });
    }
  }

>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
<<<<<<< HEAD
      
      // 检查用户权限，只有管理员或用户自己可以查看用户详情
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
      console.error('获取用户详情失败:', error);
      res.status(500).json({ error: '获取用户详情失败' });
    }
  }
  
  // 创建用户（暂时允许所有请求创建用户，方便测试）
  static async createUser(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      
      // 检查用户是否已存在
=======
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
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: '用户名已存在' });
      }
<<<<<<< HEAD
      
      // 加密密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // 创建用户
=======
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: role || 'user'
      });
<<<<<<< HEAD
      
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
<<<<<<< HEAD
      console.error('创建用户失败:', error);
      res.status(500).json({ error: '创建用户失败' });
    }
  }
  
  // 更新用户（允许用户更新自己的信息，管理员可以更新所有用户）
=======
      res.status(500).json({ error: '创建用户失败' });
    }
  }

>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;
      const user = (req as any).user;
<<<<<<< HEAD
      
      // 检查用户权限，只有管理员或用户自己可以更新用户信息
      if (user && user.role !== 'admin' && user.id !== parseInt(id)) {
        return res.status(403).json({ error: '没有权限更新用户信息' });
      }
      
      // 查找用户
=======
      if (user && user.role !== 'admin' && user.id !== parseInt(id)) {
        return res.status(403).json({ error: '没有权限更新用户信息' });
      }
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        return res.status(404).json({ error: '用户不存在' });
      }
<<<<<<< HEAD
      
      // 检查用户名是否已被其他用户使用
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      if (username && username !== targetUser.username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(400).json({ error: '用户名已存在' });
        }
      }
<<<<<<< HEAD
      
      // 构建更新数据
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const updateData: any = {};
      if (username) updateData.username = username;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
<<<<<<< HEAD
      // 只有管理员可以更新角色
      if (role && user && user.role === 'admin') updateData.role = role;
      
      // 更新用户
      await targetUser.update(updateData);
      
=======
      if (role && user && user.role === 'admin') updateData.role = role;
      await targetUser.update(updateData);
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
<<<<<<< HEAD
      console.error('更新用户失败:', error);
      res.status(500).json({ error: '更新用户失败' });
    }
  }
  
  // 删除用户（暂时允许删除，方便测试）
=======
      res.status(500).json({ error: '更新用户失败' });
    }
  }

>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
<<<<<<< HEAD
      
      // 查找用户
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        return res.status(404).json({ error: '用户不存在' });
      }
<<<<<<< HEAD
      
      // 不允许删除自己
      if (user && user.id === targetUser.id) {
        return res.status(400).json({ error: '不能删除自己' });
      }
      
      // 删除用户
      await targetUser.destroy();
      
      res.json({ message: '用户删除成功' });
    } catch (error) {
      console.error('删除用户失败:', error);
=======
      if (user && user.id === targetUser.id) {
        return res.status(400).json({ error: '不能删除自己' });
      }
      await targetUser.destroy();
      res.json({ message: '用户删除成功' });
    } catch (error) {
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
      res.status(500).json({ error: '删除用户失败' });
    }
  }
}

export default UserController;