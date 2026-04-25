import express from 'express';
import OrderRoutes from './OrderRoutes';
import DishRoutes from './DishRoutes';
import IngredientRoutes from './IngredientRoutes';
import StatsRoutes from './StatsRoutes';
import CalendarRoutes from './CalendarRoutes';
import SetMealRoutes from './SetMealRoutes';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import CategorySettingsRoutes from './CategorySettingsRoutes';
import CategoryTypeRoutes from './CategoryTypeRoutes';
import StaffRoutes from './StaffRoutes';
import VehicleRoutes from './VehicleRoutes';
import KitchenwareRoutes from './KitchenwareRoutes';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// 认证路由（不需要认证）
router.use('/api', AuthRoutes);

// 其他路由（需要认证）
router.use('/api', authMiddleware, OrderRoutes);
router.use('/api', authMiddleware, SetMealRoutes);
router.use('/api', authMiddleware, DishRoutes);
router.use('/api', authMiddleware, IngredientRoutes);
router.use('/api', authMiddleware, StatsRoutes);
router.use('/api', authMiddleware, CalendarRoutes);
router.use('/api', authMiddleware, UserRoutes);
router.use('/api', authMiddleware, CategorySettingsRoutes);
router.use('/api', authMiddleware, CategoryTypeRoutes);
router.use('/api', authMiddleware, StaffRoutes);
router.use('/api', authMiddleware, VehicleRoutes);
router.use('/api', authMiddleware, KitchenwareRoutes);

export default router;