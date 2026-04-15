# 流水宴席酒店内部订单管理系统

## 项目简介

这是一个为流水宴席酒店设计的内部订单管理系统，包含以下功能：

- 订单管理：创建、编辑、删除订单，支持选择菜品和套餐
- 菜品管理：管理菜品信息，包括菜品名称、价格、用料等
- 用料管理：管理食材信息，支持分类管理
- 套餐管理：创建和管理套餐，包含多个菜品
- 用户管理：用户认证和权限管理
- 统计功能：订单统计和食材需求统计
- 日历功能：显示订单日历

## 技术栈

### 前端
- Vue 3 + Composition API
- TypeScript
- Element Plus UI 库
- Vue Router
- Pinia 状态管理

### 后端
- Express
- TypeScript
- Sequelize ORM
- SQLite
- JWT 认证

## 安装和运行

### 后端

```bash
cd backend
npm install
npm run dev
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 系统功能

1. **用户认证**：支持用户登录和注册
2. **订单管理**：创建订单，选择菜品和套餐，设置服务日期和桌数
3. **菜品管理**：添加菜品，设置价格和用料
4. **用料管理**：管理食材，支持分类
5. **套餐管理**：创建套餐，包含多个菜品
6. **统计功能**：查看订单统计和食材需求统计
7. **日历功能**：查看订单日历

## 注意事项

- 系统使用 SQLite 作为数据库，数据存储在 `backend/database.sqlite` 文件中
- 初始管理员账户：admin / admin
- 系统默认运行在 http://localhost:5173（前端）和 http://localhost:3001（后端）