import express from 'express';
import cors from 'cors';
import dishRoutes from './routes/dish';
import ingredientRoutes from './routes/ingredient';
import orderRoutes from './routes/order';
import setMealRoutes from './routes/setMeal';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import statsRoutes from './routes/stats';
import calendarRoutes from './routes/calendar';

const app = express();

app.use(cors());
app.use(express.json());

// 路由
app.use('/api/dishes', dishRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/set-meals', setMealRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/calendar', calendarRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});