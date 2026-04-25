import express from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// 获取用户列表（需要管理员权限）
router.get('/users', authMiddleware, UserController.getUsers);

// 获取用户详情（需要管理员权限或用户自己）
router.get('/users/:id', authMiddleware, UserController.getUserById);

// 创建用户（需要管理员权限）
router.post('/users', authMiddleware, UserController.createUser);

// 更新用户（需要管理员权限或用户自己）
router.put('/users/:id', authMiddleware, UserController.updateUser);

// 删除用户（需要管理员权限）
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

export default router;