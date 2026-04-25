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

// 导出DDL语句的函数
async function exportDDL() {
  try {
    // 连接到数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 获取所有表名
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    console.log('找到的表:', tableNames);

    // 存储所有DDL语句
    const ddlStatements = [];

    // 遍历所有表，获取DDL语句
    for (const tableName of tableNames) {
      try {
        // 对于MySQL，使用SHOW CREATE TABLE语句获取DDL
        const [results] = await sequelize.query(`SHOW CREATE TABLE \`${tableName}\``);
        if (results && results.length > 0) {
          let ddl = results[0][`Create Table`];
          // 将编码改为utf8mb4
          ddl = ddl.replace(/DEFAULT CHARSET=latin1/g, 'DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
          ddlStatements.push(`-- Table: ${tableName}\n${ddl};\n\n`);
          console.log(`获取表 ${tableName} 的DDL语句成功`);
        }
      } catch (error) {
        console.error(`获取表 ${tableName} 的DDL语句失败:`, error.message);
      }
    }

    // 将DDL语句写入文件
    const outputPath = path.join(__dirname, '../ddl/');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const outputFile = path.join(outputPath, 'database-ddl.sql');
    fs.writeFileSync(outputFile, ddlStatements.join(''));
    console.log(`DDL语句已成功保存到 ${outputFile}`);

    // 关闭数据库连接
    await sequelize.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('导出DDL语句失败:', error.message);
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行导出函数
exportDDL();