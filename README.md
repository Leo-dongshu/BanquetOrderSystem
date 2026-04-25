# 流水宴席酒店内部订单管理系统

## 系统简介

流水宴席酒店内部订单管理系统是一个专为酒店内部使用的订单管理系统，主要功能包括：

- 订单管理：创建、编辑、查看订单，添加接单人信息
- 订单人员安排：为订单分配厨师、服务员、司机等人员，支持外聘司机及车辆管理
- 订单发货管理：管理订单发货状态，打印供应商市场单、消耗品出货单、设备请货单、菜品做法单
- 菜品管理：管理菜品及其用料
- 食材统计：根据订单计算所需食材
- 订单日历：显示最近1个月的订单安排

## 技术栈

- **前端**：Vue 3 + TypeScript + Vite + Pinia + Element Plus
- **后端**：Express + TypeScript + MySQL
- **工具**：ESLint + Prettier + Vite

## 系统架构

### 后端架构

- **数据模型**：使用Sequelize ORM管理数据库操作
- **API接口**：RESTful API设计
- **数据库**：MySQL（关系型数据库）

### 前端架构

- **状态管理**：使用Pinia管理全局状态
- **路由管理**：使用Vue Router管理页面路由
- **UI组件**：使用Element Plus提供界面组件
- **API调用**：使用Axios进行HTTP请求

## 系统功能

### 1. 订单管理

- 创建新订单：输入客户信息、选择服务日期、选择菜品、添加接单人
- 编辑订单：修改订单详情、更新订单状态
- 查看订单列表：显示所有订单及其状态
- 删除订单：移除不需要的订单

### 2. 订单人员安排

- 为订单分配厨师、服务员、司机等人员
- 管理外聘司机及车辆信息
- 打印订单人员安排信息
- 状态控制：未安排状态下点击打印按钮会提示先进行人员安排

### 3. 订单发货管理

- 显示已发货及以后状态的订单
- 操作列包含4个按钮：供应商市场单表格、消耗品出货单、设备请货单、菜品做法单
- 菜品做法单打印：显示订单菜品信息、做法、盘碗、备注、接单人等信息

### 4. 菜品管理

- 添加新菜品：输入菜品名称、价格、分类、描述、做法、盘碗
- 编辑菜品：修改菜品信息
- 管理菜品用料：为每个菜品添加所需的用料及用量
- 查看菜品列表：显示所有菜品及其详情

### 5. 用料管理

- 添加新用料：输入用料名称、单位、库存
- 编辑用料：修改用料信息
- 查看用料列表：显示所有用料及其库存

### 6. 统计分析

- 订单统计：统计指定日期范围内的订单数量、总金额、总人数
- 食材需求统计：根据订单计算所需的食材总量

### 7. 订单日历

- 显示最近1个月的订单安排
- 点击日期查看当天的订单详情

## Git 使用指南

### 首次克隆项目

```bash
# SSH方式（推荐）
git clone git@github.com:Leo-dongshu/BanquetOrderSystem.git

# HTTPS方式
git clone https://github.com/Leo-dongshu/BanquetOrderSystem.git

cd BanquetOrderSystem
```

### 配置Git（首次使用）

```bash
# 配置用户名
git config --global user.name "您的用户名"

# 配置邮箱
git config --global user.email "您的邮箱@example.com"
```

### 日常开发工作流程

#### 1. 拉取最新代码（开始工作前）
```bash
git pull origin main
```

#### 2. 查看修改状态
```bash
git status
```

#### 3. 添加修改的文件
```bash
# 添加所有文件
git add .

# 或添加特定文件
git add 文件名
```

#### 4. 提交修改
```bash
git commit -m "描述您的修改内容"
```

#### 5. 推送到GitHub
```bash
git push origin main
```

### 首次上传代码到GitHub（全新项目）

```bash
# 1. 初始化Git仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "初始提交：完整的宴席订单管理系统"

# 4. 添加远程仓库（SSH方式）
git remote add origin git@github.com:Leo-dongshu/BanquetOrderSystem.git

# 5. 重命名分支为main（如果需要）
git branch -M main

# 6. 推送到GitHub
git push -u origin main
```

### Git分支管理（可选）

```bash
# 创建并切换到新分支
git checkout -b feature/新功能名称

# 切换到main分支
git checkout main

# 合并分支到main
git merge feature/新功能名称

# 删除分支
git branch -d feature/新功能名称
```

### 常见问题解决

#### 问题1：SSH连接配置
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 测试SSH连接
ssh -T git@github.com
```

#### 问题2：代理配置（如需要）
```bash
# 配置代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

#### 问题3：查看提交历史
```bash
git log --oneline --graph
```

## 安装步骤

### 1. 克隆项目

```bash
git clone git@github.com:Leo-dongshu/BanquetOrderSystem.git
cd BanquetOrderSystem
```

### 2. 安装依赖

#### 后端依赖

```bash
cd backend
npm install
```

#### 前端依赖

```bash
cd ../frontend
npm install
```

### 3. 配置数据库

- 确保MySQL服务已启动
- 创建名为 `banquet_order_system` 的数据库
- 复制 backend/.env.example 为 backend/.env，并修改数据库连接信息

### 4. 启动服务

#### 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将运行在 `http://localhost:8082`

#### 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将运行在 `http://localhost:5173` 或其他可用端口

## 使用方法

### 1. 访问系统

打开浏览器，访问前端服务地址（如 `http://localhost:5173`）进入系统首页。

### 2. 管理基础数据

在开始创建订单之前，建议先添加一些基础数据：

1. 点击左侧菜单的「人员管理」，添加酒店员工信息
2. 点击左侧菜单的「用料管理」，添加所需的食材用料
3. 点击左侧菜单的「菜品管理」，添加菜品并为每个菜品分配用料

### 3. 创建订单

1. 点击左侧菜单的「订单管理」
2. 点击「创建订单」按钮
3. 输入客户信息、选择服务日期、套餐标准等
4. 选择接单人
5. 点击「提交订单」按钮

### 4. 安排订单人员

1. 点击左侧菜单的「订单人员安排」
2. 选择需要安排的订单
3. 分配厨师、服务员、司机等人员
4. 添加外聘司机及车辆信息（如有需要）
5. 点击「保存人员安排」按钮

### 5. 管理订单发货

1. 点击左侧菜单的「订单发货管理」
2. 选择需要操作的订单
3. 点击相应按钮打印所需单据

### 6. 查看统计和日历

1. 点击左侧菜单的「统计分析」，查看订单和食材统计
2. 点击左侧菜单的「订单日历」，查看最近1个月的订单安排

## 系统配置

### 后端配置

- **端口**：默认运行在 8082 端口，可在 `src/main.ts` 中修改
- **数据库**：使用MySQL，配置通过环境变量或 .env 文件
- **时区**：默认设置为 '+08:00'，确保时间显示正确

### 前端配置

- **API地址**：默认指向 `http://localhost:8082/api`，可在 `src/api/index.ts` 中修改
- **端口**：默认运行在 5173 端口，可在 `vite.config.ts` 中修改

## 项目结构

### 后端项目结构

```
backend/
├── src/
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   ├── app.ts          # 应用配置
│   └── main.ts         # 入口文件
├── package.json        # 依赖配置
└── tsconfig.json       # TypeScript配置
```

### 前端项目结构

```
frontend/
├── src/
│   ├── api/            # API服务
│   ├── components/      # 组件
│   ├── router/         # 路由
│   ├── store/          # 状态管理
│   ├── types/          # 类型定义
│   ├── views/           # 页面
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── package.json        # 依赖配置
└── tsconfig.json       # TypeScript配置
```

## 注意事项

1. 系统使用MySQL数据库，需要先创建数据库并配置连接信息
2. 首次启动时会自动创建数据库表结构并初始化基础数据
3. 建议在使用前先添加一些基础的菜品、用料和人员数据
4. 打印功能需要浏览器支持打印操作
5. 建议使用SSH方式连接GitHub，更安全稳定

## 未来优化方向

1. 添加用户认证和权限管理
2. 支持数据导出和导入
3. 添加库存管理功能
4. 优化系统性能和用户体验
5. 支持更多的统计分析功能
6. 增加移动端适配

## 联系方式

如有问题或建议，请联系系统管理员。

## 仓库地址

- GitHub: https://github.com/Leo-dongshu/BanquetOrderSystem
