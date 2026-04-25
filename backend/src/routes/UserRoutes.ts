import express from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/users', authMiddleware, UserController.getUsers);
router.get('/users/:id', authMiddleware, UserController.getUserById);
router.post('/users', authMiddleware, UserController.createUser);
router.put('/users/:id', authMiddleware, UserController.updateUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

export default router;