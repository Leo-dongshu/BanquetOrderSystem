import express from 'express';
import SetMealController from '../controllers/SetMealController';

const router = express.Router();

<<<<<<< HEAD
// 获取套餐列表
router.get('/set-meals', SetMealController.getSetMeals);

// 创建新套餐
router.post('/set-meals', SetMealController.createSetMeal);

// 获取套餐详情
router.get('/set-meals/:id', SetMealController.getSetMealById);

// 更新套餐
router.put('/set-meals/:id', SetMealController.updateSetMeal);

// 删除套餐
router.delete('/set-meals/:id', SetMealController.deleteSetMeal);

export default router;
=======
router.get('/set-meals', SetMealController.getSetMeals);
router.post('/set-meals', SetMealController.createSetMeal);
router.get('/set-meals/:id', SetMealController.getSetMealById);
router.put('/set-meals/:id', SetMealController.updateSetMeal);
router.delete('/set-meals/:id', SetMealController.deleteSetMeal);

export default router;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
