# 部署文档

## 目录结构

```
deploy/
├── nginx.conf      # Nginx 配置文件
├── setup.sh        # 服务器环境初始化脚本
├── backup-db.sh    # 数据库备份脚本
└── README.md       # 本文档
```

## 快速开始

### 1. 服务器初始化

在阿里云服务器上执行：

```bash
# 上传项目到服务器
cd /var/www
git clone https://github.com/Leo-dongshu/BanquetOrderSystem.git
cd BanquetOrderSystem/deploy

# 执行初始化脚本
chmod +x setup.sh
./setup.sh
```

### 2. 配置数据库

```bash
# 登录 MySQL
mysql -u root -p
```

执行以下 SQL：

```sql
CREATE DATABASE banquet_order_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'banquet_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON banquet_order_system.* TO 'banquet_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

保存密码到文件：

```bash
echo 'your_strong_password' > /root/.db_password
chmod 600 /root/.db_password
```

### 3. 部署后端

```bash
cd /var/www/BanquetOrderSystem/backend

# 配置环境变量
cp .env.example .env
nano .env

# 修改以下内容：
# NODE_ENV=production
# DB_HOST=localhost
# DB_USER=banquet_user
# DB_PASSWORD=your_strong_password
# JWT_SECRET=生产环境的强密钥

# 安装依赖并构建
npm install
npm run build

# 使用 PM2 启动
pm2 start dist/main.js --name banquet-backend
pm2 save
pm2 startup
```

### 4. 部署前端

#### 方案 A：本地构建后上传（推荐，速度快）

```bash
# 在本地电脑上执行
cd d:\code\workspases\BanquetOrderSystem\frontend

# 配置环境变量（如果需要自定义 API 地址）
# 复制示例文件
cp .env.example .env.production
# 编辑 .env.production，根据需要修改 VITE_API_BASE_URL
# 如果前端和后端部署在同一域名，保持 /api 即可
# 如果不同域名，修改为完整地址：http://your-domain.com/api

# 本地构建（使用生产环境配置）
npm run build

# 将 dist 文件夹上传到服务器
# 使用 scp 或其他工具上传到 /var/www/BanquetOrderSystem/frontend/dist
```

#### 方案 B：服务器构建（较慢）

```bash
cd /var/www/BanquetOrderSystem/frontend

# 配置环境变量
cp .env.example .env.production
nano .env.production
# 根据需要修改 VITE_API_BASE_URL

# 安装依赖并构建
npm install
npm run build
```

### 5. 配置 Nginx

```bash
# 复制配置文件
cp /var/www/BanquetOrderSystem/deploy/nginx.conf /etc/nginx/sites-available/banquet

# 创建软链接
ln -s /etc/nginx/sites-available/banquet /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

### 6. 配置防火墙

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 7. 配置自动备份

```bash
# 设置备份脚本权限
chmod +x /var/www/BanquetOrderSystem/deploy/backup-db.sh

# 添加到 crontab
crontab -e
# 添加以下行（每天凌晨2点备份）
0 2 * * * /root/var/www/BanquetOrderSystem/deploy/backup-db.sh
```

## 常用命令

### 后端服务管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs banquet-backend

# 重启服务
pm2 restart banquet-backend

# 停止服务
pm2 stop banquet-backend
```

### Nginx 管理

```bash
# 测试配置
nginx -t

# 重载配置
systemctl reload nginx

# 重启服务
systemctl restart nginx

# 查看状态
systemctl status nginx
```

### 数据库管理

```bash
# 登录
mysql -u banquet_user -p

# 手动备份
/var/www/BanquetOrderSystem/deploy/backup-db.sh
```

### 前端开发

```bash
# 进入前端目录
cd frontend

# 开发环境启动
npm run dev

# 用生产环境配置开发（测试用）
npm run dev:prod

# 生产环境构建
npm run build

# 开发环境构建（测试用）
npm run build:dev

# 预览生产构建
npm run preview
```

## 故障排查

### 前端 API 请求 404

**问题**：前端请求 API 返回 404

**解决方法**：

1. 检查 `.env.production` 中的 `VITE_API_BASE_URL` 配置是否正确
2. 检查 Nginx 配置是否正确代理 `/api` 请求
3. 检查后端服务是否正常运行

### 跨域问题 (CORS)

**问题**：浏览器提示跨域错误

**解决方法**：

1. 开发环境：确保 Vite 代理配置正确（已自动配置）
2. 生产环境：
   - 推荐方案：使用 Nginx 代理，前端和后端在同一域名下
   - 备选方案：后端配置 CORS 允许前端域名访问

### 修改环境变量不生效

**解决方法**：

1. 确保修改的是正确的环境文件（`.env.development` 或 `.env.production`）
2. 修改后必须重启开发服务器或重新构建
3. 环境变量必须以 `VITE_` 开头才能在前端代码中访问

## 生产服务器代码更新

### 更新前准备

```bash
# 进入项目目录
cd /var/www/BanquetOrderSystem

# 查看当前状态
git status
```

### 完整更新流程（推荐）

```bash
# 1. 备份数据库（非常重要！）
/var/www/BanquetOrderSystem/deploy/backup-db.sh

# 2. 查看当前分支和状态
cd /var/www/BanquetOrderSystem
git status

# 3. 拉取最新代码
git pull origin main  # 或你的分支名

# 4. 更新后端
cd /var/www/BanquetOrderSystem/backend

# 检查 package.json 是否有变更
git diff HEAD~1 HEAD -- package.json
# 如果有变更，重新安装依赖
npm install

# 重新构建后端
npm run build

# 重启后端服务
pm2 restart banquet-backend

# 5. 更新前端
cd /var/www/BanquetOrderSystem/frontend

# 检查 package.json 或环境变量是否有变更
git diff HEAD~1 HEAD -- package.json .env.production
# 如果 package.json 有变更，重新安装依赖
npm install

# 重新构建前端（使用生产环境配置）
npm run build

# 6. 验证更新
# 检查后端服务状态
pm2 status

# 检查后端日志
pm2 logs banquet-backend --lines 50

# 检查 Nginx 状态
systemctl status nginx
```

### 快速更新流程（仅代码变更，无依赖更新）

```bash
# 1. 备份数据库
/var/www/BanquetOrderSystem/deploy/backup-db.sh

# 2. 拉取代码
cd /var/www/BanquetOrderSystem

# 丢弃所有未提交的生产环境修改（更彻底）
git reset --hard HEAD

git pull origin main

# 3. 更新后端
cd backend
npm run build
pm2 restart banquet-backend

# 4. 更新前端
cd ../frontend
npm run build

# 5. 验证
pm2 status
```

### 仅更新前端

```bash
# 1. 备份数据库
/var/www/BanquetOrderSystem/deploy/backup-db.sh

# 2. 拉取代码
cd /var/www/BanquetOrderSystem
git pull origin main

# 3. 更新前端
cd frontend
npm run build

# 前端不需要重启服务，构建完成后刷新浏览器即可
```

### 仅更新后端

```bash
# 1. 备份数据库
/var/www/BanquetOrderSystem/deploy/backup-db.sh

# 2. 拉取代码
cd /var/www/BanquetOrderSystem
git pull origin main

# 3. 更新后端
cd backend
npm run build
pm2 restart banquet-backend
```

### 回滚操作

如果更新后出现问题，可以快速回滚：

```bash
# 1. 查看提交历史
cd /var/www/BanquetOrderSystem
git log --oneline -10

# 2. 回滚到上一个版本
git reset --hard HEAD~1

# 3. 重新构建和重启服务（按照上面的更新流程）

# 4. 如果需要恢复数据库
# 找到最近的备份文件
ls -la /var/backups/banquet/
# 恢复数据库（根据实际文件名替换）
mysql -u banquet_user -p banquet_order_system < /var/backups/banquet/banquet_order_system_YYYY-MM-DD_HH-MM.sql
```

### 更新检查清单

每次更新前请确认：

- [ ] 已备份数据库
- [ ] 已查看 git diff，了解变更内容
- [ ] 检查是否有数据库迁移需要执行
- [ ] 检查是否有环境变量或配置文件变更

### Git 分支管理建议

```bash
# 生产环境使用 main 分支
git checkout main

# 如果使用其他分支部署
git checkout production
git pull origin production
```

