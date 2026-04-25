import express from 'express';
import CalendarController from '../controllers/CalendarController';

const router = express.Router();

router.get('/calendar/orders', CalendarController.getOrderCalendar);

export default router;