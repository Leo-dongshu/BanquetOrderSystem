import express from 'express';
import StaffController from '../controllers/StaffController';

const router = express.Router();

router.get('/staff', StaffController.getStaffList);
router.post('/staff', StaffController.createStaff);
router.get('/staff/:id', StaffController.getStaffById);
router.put('/staff/:id', StaffController.updateStaff);
router.delete('/staff/:id', StaffController.deleteStaff);

export default router;