import express from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// 注册路由
router.post('/auth/register', AuthController.register);

// 登录路由
router.post('/auth/login', AuthController.login);

// 获取当前用户信息路由（需要认证）
router.get('/auth/me', authMiddleware, AuthController.getCurrentUser);

export default router;