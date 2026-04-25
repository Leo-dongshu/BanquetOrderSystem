# MySQL连接指南：192.168.12.130

## 问题分析
通过测试发现：
- ✅ 网络连接正常（ping 192.168.12.130 成功）
- ❌ MySQL 3306 端口未开放（Test-NetConnection 失败）

## 解决方案

### 1. 登录到虚拟机
使用 SSH 或直接登录到 192.168.12.130 虚拟机

### 2. 检查MySQL服务状态
```bash
# 检查MySQL服务状态
sudo systemctl status mysql

# 如果服务未运行，启动服务
sudo systemctl start mysql

# 设置服务开机自启
sudo systemctl enable mysql
```

### 3. 检查MySQL配置
编辑MySQL配置文件，确保允许远程连接：
```bash
# 编辑MySQL配置文件
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# 找到并注释掉以下行（如果存在）
# bind-address = 127.0.0.1

# 保存并退出

# 重启MySQL服务
sudo systemctl restart mysql
```

### 4. 检查防火墙设置
```bash
# 检查防火墙状态
sudo ufw status

# 如果防火墙已启用，开放3306端口
sudo ufw allow 3306/tcp

# 重新加载防火墙规则
sudo ufw reload
```

### 5. 创建数据库和用户
```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE banquet_order_system;

# 创建用户并授权
CREATE USER 'leo'@'%' IDENTIFIED BY 'leo123';
GRANT ALL PRIVILEGES ON banquet_order_system.* TO 'leo'@'%';
FLUSH PRIVILEGES;

# 退出MySQL
EXIT;
```

### 6. 测试连接
在本地运行：
```bash
# 测试MySQL连接
mysql -h 192.168.12.130 -u leo -p
```

### 7. 重启后端服务
```bash
# 停止后端服务
# 重新启动后端服务
npm run dev
```

## 故障排查
如果连接仍然失败：
1. 检查虚拟机网络设置
2. 确认MySQL服务正在监听3306端口
3. 检查MySQL错误日志
4. 验证用户名和密码是否正确

## 预期结果
- 后端服务能够成功连接到192.168.12.130上的MySQL数据库
- 数据库表结构能够自动创建
- 系统能够正常运行