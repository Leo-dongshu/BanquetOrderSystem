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

```bash
cd /var/www/BanquetOrderSystem/frontend

# 修改 API 地址
nano src/api/index.ts
# 将 baseURL 修改为你的服务器地址或域名

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
0 2 * * * /var/www/BanquetOrderSystem/deploy/backup-db.sh
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
