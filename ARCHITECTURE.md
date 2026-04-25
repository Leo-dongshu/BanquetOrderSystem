# 流水宴席酒店内部订单管理系统架构设计

## 1. 系统架构

### 1.1 技术栈

- **前端**：Vue 3 + TypeScript + Vite + Pinia + Element Plus
- **后端**：Express + TypeScript + PostgreSQL
- **工具**：ESLint + Prettier + Vite

### 1.2 系统模块

1. **订单管理**：创建、编辑、查看订单
2. **菜品管理**：管理菜品及其用料
3. **食材统计**：根据订单计算所需食材
4. **订单日历**：显示最近1个月的订单安排
5. **用户管理**：用户认证和权限控制

## 2. 数据库设计

### 2.1 数据模型

#### 2.1.1 订单表 (orders)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 订单ID |
| customer_name | VARCHAR(255) | NOT NULL | 客户姓名 |
| customer_phone | VARCHAR(20) | NOT NULL | 客户电话 |
| service_date | DATE | NOT NULL | 服务日期 |
| total_guests | INTEGER | NOT NULL | 总人数 |
| total_amount | DECIMAL(10,2) | NOT NULL | 总金额 |
| status | VARCHAR(20) | NOT NULL | 订单状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

#### 2.1.2 菜品表 (dishes)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 菜品ID |
| name | VARCHAR(255) | NOT NULL | 菜品名称 |
| price | DECIMAL(10,2) | NOT NULL | 菜品价格 |
| category | VARCHAR(50) | NOT NULL | 菜品分类 |
| description | TEXT | | 菜品描述 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

#### 2.1.3 用料表 (ingredients)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 用料ID |
| name | VARCHAR(255) | NOT NULL | 用料名称 |
| unit | VARCHAR(20) | NOT NULL | 计量单位 |
| stock | DECIMAL(10,2) | DEFAULT 0 | 库存数量 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

#### 2.1.4 订单菜品表 (order_dishes)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 记录ID |
| order_id | INTEGER | REFERENCES orders(id) | 订单ID |
| dish_id | INTEGER | REFERENCES dishes(id) | 菜品ID |
| quantity | INTEGER | NOT NULL | 数量 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

#### 2.1.5 菜品用料表 (dish_ingredients)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 记录ID |
| dish_id | INTEGER | REFERENCES dishes(id) | 菜品ID |
| ingredient_id | INTEGER | REFERENCES ingredients(id) | 用料ID |
| quantity | DECIMAL(10,2) | NOT NULL | 用量 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

## 3. API设计

### 3.1 订单相关API
- `GET /api/orders`：获取订单列表
- `POST /api/orders`：创建新订单
- `GET /api/orders/:id`：获取订单详情
- `PUT /api/orders/:id`：更新订单
- `DELETE /api/orders/:id`：删除订单

### 3.2 菜品相关API
- `GET /api/dishes`：获取菜品列表
- `POST /api/dishes`：创建新菜品
- `GET /api/dishes/:id`：获取菜品详情
- `PUT /api/dishes/:id`：更新菜品
- `DELETE /api/dishes/:id`：删除菜品

### 3.3 用料相关API
- `GET /api/ingredients`：获取用料列表
- `POST /api/ingredients`：创建新用料
- `GET /api/ingredients/:id`：获取用料详情
- `PUT /api/ingredients/:id`：更新用料
- `DELETE /api/ingredients/:id`：删除用料

### 3.4 统计相关API
- `GET /api/stats/ingredients`：统计食材需求
- `GET /api/stats/orders`：统计订单数据

### 3.5 日历相关API
- `GET /api/calendar/orders`：获取订单日历数据

## 4. 前端页面设计

### 4.1 页面结构
1. **登录页**：用户登录
2. **仪表盘**：系统概览
3. **订单管理**：订单列表和详情
4. **菜品管理**：菜品和用料管理
5. **食材统计**：食材需求统计
6. **订单日历**：订单日期安排

### 4.2 功能模块
- **订单创建**：选择菜品、设置日期和人数
- **菜品编辑**：添加/编辑菜品及其用料
- **食材计算**：根据订单自动计算所需食材
- **日历视图**：显示最近1个月的订单安排
- **数据导出**：导出订单和食材统计数据

## 5. 系统流程

1. **订单创建流程**：
   - 输入客户信息
   - 选择服务日期和人数
   - 选择所需菜品
   - 确认订单详情
   - 生成订单

2. **食材统计流程**：
   - 选择日期范围
   - 系统自动计算所需食材
   - 显示食材清单
   - 导出食材采购清单

3. **订单管理流程**：
   - 查看订单列表
   - 编辑订单详情
   - 更新订单状态
   - 查看订单历史

## 6. 安全考虑

- 使用JWT进行用户认证
- 实现角色权限控制
- 数据验证和输入 sanitization
- 防止SQL注入和XSS攻击
- 密码加密存储

## 7. 性能优化

- 使用数据库索引提高查询性能
- 实现API缓存减少数据库负载
- 前端懒加载和代码分割
- 优化数据库查询语句
- 使用事务确保数据一致性