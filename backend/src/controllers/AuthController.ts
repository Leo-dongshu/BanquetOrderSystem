import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class AuthController {
  // 用户注册
  static async register(req: Request, res: Response) {
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
      
      res.json({ message: '注册成功', user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({ error: '注册失败' });
    }
  }
  
  // 用户登录
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      // 查找用户
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }
      
      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }
      
      // 生成JWT令牌
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      res.json({ message: '登录成功', token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({ error: '登录失败' });
    }
  }
  
  // 获取当前用户信息
  static async getCurrentUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: '未登录' });
      }
      
      res.json({ user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.status(500).json({ error: '获取用户信息失败' });
    }
  }
}

export default AuthController;