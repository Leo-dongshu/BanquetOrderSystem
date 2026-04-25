const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// 数据库连接配置
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '192.168.12.130',
  port: 3306,
  username: 'leo',
  password: 'leo123',
  database: 'banquet_order_system',
  logging: console.log,
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    connectTimeout: 10000,
    timezone: '+08:00'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00'
});

// 导入DDL语句的函数
async function importDDL() {
  try {
    // 连接到数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 先删除所有表（按照依赖关系顺序）
    console.log('开始删除现有表...');
    const tablesToDrop = [
      'dish_ingredients',
      'order_dishes',
      'order_set_meals',
      'set_meal_dishes',
      'order_staff_arrangements',
      'order_status_history',
      'orders',
      'dishes',
      'ingredients',
      'set_meals',
      'category_settings',
      'category_types',
      'categories',
      'staff',
      'vehicles',
      'users',
      'order_statuses'
    ];

    for (const table of tablesToDrop) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`删除表 ${table} 成功`);
      } catch (error) {
        console.error(`删除表 ${table} 失败:`, error.message);
      }
    }

    // 读取DDL文件
    const ddlFilePath = path.join(__dirname, '../ddl/database-ddl.sql');
    if (!fs.existsSync(ddlFilePath)) {
      throw new Error(`DDL文件不存在: ${ddlFilePath}`);
    }

    const ddlContent = fs.readFileSync(ddlFilePath, 'utf8');
    console.log('DDL文件读取成功');

    // 分割DDL语句
    const statements = ddlContent.split(';').filter(statement => statement.trim() !== '');
    console.log(`找到 ${statements.length} 条SQL语句`);

    // 按照依赖顺序执行DDL语句
    // 先创建基础表，再创建依赖它们的表
    const tableOrder = [
      'category_types',
      'category_settings',
      'order_statuses',
      'users',
      'staff',
      'vehicles',
      'dishes',
      'ingredients',
      'set_meals',
      'dish_ingredients',
      'set_meal_dishes',
      'orders',
      'order_dishes',
      'order_set_meals',
      'order_staff_arrangements',
      'order_status_history'
    ];

    // 按顺序执行DDL语句
    for (const tableName of tableOrder) {
      // 找到对应表的DDL语句
      const tableStatement = statements.find(statement => 
        statement.includes(`-- Table: ${tableName}`)
      );

      if (tableStatement) {
        try {
          await sequelize.query(tableStatement);
          console.log(`创建表 ${tableName} 成功`);
        } catch (error) {
          console.error(`创建表 ${tableName} 失败:`, error.message);
        }
      }
    }

    console.log('数据库结构重新创建完成');

    // 关闭数据库连接
    await sequelize.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('导入DDL语句失败:', error.message);
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行导入函数
importDDL();