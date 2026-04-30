import express from 'express';
import cors from 'cors';
import routes from './routes';
import sequelize from './config/database';
import { CategoryType, User, CategorySetting, OrderStatus } from './models';
import bcrypt from 'bcrypt';
import logger from './utils/logger';

const initializeData = async () => {
  try {
    const cancelStatus = await OrderStatus.findByPk(-1);
    if (!cancelStatus) {
      await OrderStatus.create({
        id: -1,
        name: '退订',
        description: '订单已退订'
      });
      logger.info('已初始化退订状态(id=-1)');
    }
  } catch (error) {
    logger.error('初始化数据失败:', error);
  }
};

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置响应头，确保字符编码正确
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 路由
app.use(routes);

// 测试端点
app.get('/', (req, res) => {
  res.json({ message: '流水宴席酒店订单管理系统 API' });
});


// 数据库连接
sequelize.authenticate()
  .then(() => {
    logger.info('数据库连接成功');
    const syncOptions = { force: false };
    
    sequelize.sync(syncOptions)
      .then(() => {
        logger.info('数据库表结构同步完成');
        logger.info('开始执行数据初始化...');
        initializeData();
        logger.info('服务器启动成功，监听端口 8082');
      })
      .catch((error) => {
        logger.error('数据库表结构同步失败:', error);
      });
  })
  .catch((error) => {
    logger.error('数据库连接失败:', error);
  });

export default app;