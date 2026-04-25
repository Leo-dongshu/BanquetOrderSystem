import express from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, UserController.getUsers);
router.post('/', authMiddleware, UserController.createUser);
router.get('/:id', authMiddleware, UserController.getUserById);
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

export default router;