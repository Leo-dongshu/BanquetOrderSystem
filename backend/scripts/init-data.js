const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');


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

// 初始化数据的函数
async function initData() {
  try {
    // 连接到数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 先truncate表数据
    console.log('开始清空表数据...');
    const tablesToTruncate = ['order_statuses', 'category_types', 'category_settings', 'users'];
    
    for (const table of tablesToTruncate) {
      try {
        await sequelize.query(`TRUNCATE TABLE ${table}`);
        console.log(`清空表 ${table} 成功`);
      } catch (error) {
        console.error(`清空表 ${table} 失败:`, error.message);
      }
    }

    // 初始化订单状态
    console.log('开始初始化订单状态...');
    const orderStatuses = [
      { id: -1, name: '已取消', description: '客户退订' },
      { id: 1, name: '待安排', description: '新建订单默认状态' },
      { id: 2, name: '已安排', description: '人员安排完成' },
      { id: 3, name: '待回款', description: '服务完成' },
      { id: 9, name: '已完成', description: '尾款回收' }
    ];

    for (const status of orderStatuses) {
      try {
        await sequelize.query(
          'INSERT INTO order_statuses (id, name, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), updated_at = NOW()',
          { replacements: [status.id, status.name, status.description] }
        );
        console.log(`订单状态 ${status.name} 初始化成功`);
      } catch (error) {
        console.error(`订单状态 ${status.name} 初始化失败:`, error.message);
      }
    }

    // 初始化类别类型
    console.log('开始初始化类别类型...');
    const categoryTypes = [
      { name: '配料类型' },
      { name: '厨具类型' },
      { name: '菜品做法' },
      { name: '套餐类型' },
      { name: '职位类型' },
      { name: '人员类型' },
      { name: '车辆类型' },
      { name: '酒席类型' },
      { name: '支付方式' },
      { name: '了解渠道' }
    ];

    for (const type of categoryTypes) {
      try {
        await sequelize.query(
          'INSERT INTO category_types (name, createdBy, updatedBy, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE name = VALUES(name), updatedBy = VALUES(updatedBy), updated_at = NOW()',
          { replacements: [type.name, 'system', 'system'] }
        );
        console.log(`类别类型 ${type.name} 初始化成功`);
      } catch (error) {
        console.error(`类别类型 ${type.name} 初始化失败:`, error.message);
      }
    }

    // 初始化类别设置
    console.log('开始初始化类别设置...');
    const categorySettings = [
      // 了解渠道
      { type: '了解渠道', name: '抖音' },
      { type: '了解渠道', name: '吃过' },
      { type: '了解渠道', name: '朋友介绍' },
      // 菜品做法
      { type: '菜品做法', name: '炒菜' },
      { type: '菜品做法', name: '例汤' },
      { type: '菜品做法', name: '炖菜' },
      // 配料类型
      { type: '配料类型', name: '蔬菜类' },
      { type: '配料类型', name: '牛羊肉类' },
      { type: '配料类型', name: '猪肉类' },
      { type: '配料类型', name: '禽类' },
      { type: '配料类型', name: '水产' },
      { type: '配料类型', name: '本地食材' },
      // 厨具类型
      { type: '厨具类型', name: '餐具盘碗' },
      { type: '厨具类型', name: '大设备' },
      { type: '厨具类型', name: '厨房小设备' },
      // 职位类型
      { type: '职位类型', name: '全职' },
      { type: '职位类型', name: '兼职' },
      // 人员类型
      { type: '人员类型', name: '厨师' },
      { type: '人员类型', name: '服务员' },
      { type: '人员类型', name: '司机' },
      // 车辆类型
      { type: '车辆类型', name: '小货车' },
      { type: '车辆类型', name: '面包车' },
      // 支付方式
      { type: '支付方式', name: '支付宝' },
      { type: '支付方式', name: '微信' },
      // 酒席类型
      { type: '酒席类型', name: '升学宴' },
      { type: '酒席类型', name: '婚宴' },
      // 套餐类型
      { type: '套餐类型', name: '多桌套餐' }
    ];
    
    for (const setting of categorySettings) {
      try {
        await sequelize.query(
          'INSERT INTO category_settings (type, name, createdBy, updatedBy, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          { replacements: [setting.type, setting.name, 'system', 'system'] }
        );
        console.log(`类别设置 ${setting.type} - ${setting.name} 初始化成功`);
      } catch (error) {
        console.error(`类别设置 ${setting.type} - ${setting.name} 初始化失败:`, error.message);
      }
    }

    // 初始化默认用户
    console.log('开始初始化默认用户...');
    try {
      // 检查用户是否已存在
      const [users] = await sequelize.query('SELECT * FROM users WHERE username = ?', { replacements: ['system'] });
      if (users.length === 0) {
        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123', salt);
        await sequelize.query(
          'INSERT INTO users (username, password, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
          { replacements: ['system', hashedPassword, 'admin'] }
        );
        console.log('默认用户 system 初始化成功');
      } else {
        console.log('默认用户 system 已存在');
      }
    } catch (error) {
      console.error('默认用户初始化失败:', error.message);
    }

    console.log('数据库初始化数据加载完成');

    // 关闭数据库连接
    await sequelize.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('初始化数据失败:', error.message);
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 执行初始化函数
initData();