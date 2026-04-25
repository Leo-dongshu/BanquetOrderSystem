import express from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middleware/auth';

const router = express.Router();


router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

router.get('/auth/me', authMiddleware, AuthController.getCurrentUser);

export default router;