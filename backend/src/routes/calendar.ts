import express from 'express';
import CalendarController from '../controllers/CalendarController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, CalendarController.getCalendarData);

export default router;