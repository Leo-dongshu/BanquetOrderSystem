# MySQL 3306端口配置指南

## 问题分析
- ✅ 网络连接正常（ping 192.168.12.130 成功）
- ✅ MariaDB服务正在运行（Active: active (running)）
- ❌ MySQL 3306 端口未开放（Test-NetConnection 失败）

## 解决方案

### 1. 登录到虚拟机
使用SSH或直接登录到192.168.12.130虚拟机

### 2. 检查防火墙设置
```bash
# 检查当前开放的端口
sudo firewall-cmd --list-ports

# 检查防火墙状态
sudo firewall-cmd --state

# 永久开放3306端口
sudo firewall-cmd --permanent --add-port=3306/tcp

# 重新加载防火墙规则
sudo firewall-cmd --reload

# 验证端口是否已开放
sudo firewall-cmd --list-ports
```

### 3. 检查MySQL配置
```bash
# 查找MySQL配置文件
find /etc -name "my.cnf" -o -name "mysqld.cnf"

# 编辑MySQL配置文件（根据实际路径）
sudo nano /etc/my.cnf
# 或
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# 找到并注释掉以下行（如果存在）
# bind-address = 127.0.0.1

# 保存并退出

# 重启MySQL服务
sudo systemctl restart mariadb
```

### 4. 检查MySQL监听状态
```bash
# 检查3306端口是否正在监听
sudo netstat -tulpn | grep 3306
# 或
sudo ss -tulpn | grep 3306
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
Test-NetConnection -ComputerName 192.168.12.130 -Port 3306

# 或使用MySQL客户端测试
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
5. 检查SELinux设置（如果启用）

## 预期结果
- 3306端口能够成功开放
- 后端服务能够成功连接到192.168.12.130上的MySQL数据库
- 数据库表结构能够自动创建
- 系统能够正常运行