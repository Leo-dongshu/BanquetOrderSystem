# MariaDB 5.5.68 升级到 MySQL 8.0 实施计划

## 现状分析

- 当前系统：CentOS 系统，使用 MariaDB 5.5.68
- 已备份数据库：`banquet_order_system.sql`
- 目标：升级到 MySQL 8.0

## 升级风险评估

1. **数据兼容性**：MariaDB 5.5 到 MySQL 8.0 的数据迁移可能存在兼容性问题
2. **应用程序兼容性**：Sequelize ORM 可能需要调整以适应 MySQL 8.0
3. **服务中断**：升级过程会导致数据库服务暂时不可用
4. **配置变更**：MySQL 8.0 的配置与 MariaDB 5.5 有差异
5. **YUM 仓库问题**：可能遇到 YUM 仓库连接或配置问题

## 升级计划

### 阶段一：准备工作

1. **备份验证**
   - 确认 `banquet_order_system.sql` 备份文件存在且完整
   - 验证备份文件大小和内容

2. **系统准备**
   - 检查网络连接：`ping -c 4 mirror.centos.org`
   - 清理 YUM 缓存：`sudo yum clean all && sudo rm -rf /var/cache/yum`
   - 重建 YUM 缓存：`sudo yum makecache`
   - 更新系统包：`sudo yum update -y`
   - 安装必要的依赖：`sudo yum install -y wget perl-DBD-MySQL`

3. **应用程序准备**
   - 更新 Sequelize 版本到支持 MySQL 8.0 的版本
   - 检查并调整数据库连接配置

### 阶段二：卸载 MariaDB

1. **停止服务**
   ```bash
   sudo systemctl stop mariadb
   sudo systemctl disable mariadb
   ```

2. **卸载包**
   ```bash
   # 查看已安装的 MariaDB 包
   sudo rpm -qa | grep -i mariadb
   
   # 卸载包
   sudo yum remove -y mariadb-server mariadb-client mariadb-common mariadb-libs
   ```

3. **清理残留**
   ```bash
   sudo rm -rf /var/lib/mysql
   sudo rm -rf /etc/my.cnf
   sudo rm -rf /etc/my.cnf.d  # 同时删除 my.cnf.d 目录
   ```

### 阶段三：安装 MySQL 8.0

1. **添加 MySQL YUM 仓库**
   ```bash
   wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
   sudo rpm -ivh mysql80-community-release-el7-3.noarch.rpm
   ```

2. **修复 YUM 仓库问题**（如果遇到问题）
   - 检查网络连接：`ping -c 4 dev.mysql.com`
   - 清理 YUM 缓存：`sudo yum clean all`
   - 编辑 MySQL 仓库配置：`sudo vi /etc/yum.repos.d/mysql-community.repo`
   - 确保 baseurl 配置正确，例如：
     ```
     [mysql80-community]
     name=MySQL 8.0 Community Server
     baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/7/$basearch/
     enabled=1
     gpgcheck=1
     gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
     ```

3. **安装 MySQL 8.0**
   ```bash
   sudo yum clean all
   sudo yum install -y mysql-community-server
   ```

   **备选方案**（如果 YUM 安装失败）：
   - 下载 RPM 包手动安装：
     ```bash
     wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-community-server-8.0.36-1.el7.x86_64.rpm
     wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-community-client-8.0.36-1.el7.x86_64.rpm
     wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-community-common-8.0.36-1.el7.x86_64.rpm
     wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-community-libs-8.0.36-1.el7.x86_64.rpm
     
     sudo rpm -ivh mysql-community-common-8.0.36-1.el7.x86_64.rpm
     sudo rpm -ivh mysql-community-libs-8.0.36-1.el7.x86_64.rpm
     sudo rpm -ivh mysql-community-client-8.0.36-1.el7.x86_64.rpm
     sudo rpm -ivh mysql-community-server-8.0.36-1.el7.x86_64.rpm
     ```

4. **启动服务**
   ```bash
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   ```

5. **初始化 MySQL**
   ```bash
   # 获取临时密码
   sudo grep 'temporary password' /var/log/mysqld.log
   
   # 运行安全安装脚本
   sudo mysql_secure_installation
   ```

### 阶段四：恢复数据

1. **创建数据库**
   ```bash
   mysql -u root -p
   CREATE DATABASE banquet_order_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'leo'@'localhost' IDENTIFIED BY 'leo123';
   GRANT ALL PRIVILEGES ON banquet_order_system.* TO 'leo'@'localhost';
   FLUSH PRIVILEGES;
   exit;
   ```

2. **恢复数据**
   ```bash
   mysql -u leo -p banquet_order_system < banquet_order_system.sql
   ```

### 阶段五：配置调整

1. **调整 MySQL 配置**
   - 编辑 `/etc/my.cnf` 文件
   - 添加或修改以下配置：
     ```
     [mysqld]
     character-set-server=utf8mb4
     collation-server=utf8mb4_unicode_ci
     default_authentication_plugin=mysql_native_password
     ```

2. **重启服务**
   ```bash
   sudo systemctl restart mysqld
   ```

### 阶段六：应用程序调整

1. **更新 Sequelize 配置**
   - 修改 `backend/src/config/database.ts` 文件
   - 确保连接配置正确：
     ```typescript
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
     ```

2. **测试连接**
   - 启动后端服务
   - 检查是否能够正常连接数据库

### 阶段七：验证升级

1. **检查 MySQL 版本**
   ```bash
   mysql --version
   ```

2. **检查数据库状态**
   ```bash
   mysql -u leo -p
   SHOW DATABASES;
   USE banquet_order_system;
   SHOW TABLES;
   SELECT COUNT(*) FROM orders;
   exit;
   ```

3. **测试应用程序**
   - 启动前端服务
   - 测试所有功能是否正常
   - 特别测试数据库相关操作

## 回滚计划

如果升级过程中出现问题，可执行以下回滚步骤：

1. **停止 MySQL 服务**
   ```bash
   sudo systemctl stop mysqld
   sudo systemctl disable mysqld
   ```

2. **卸载 MySQL**
   ```bash
   sudo yum remove -y mysql-community-server mysql-community-client
   ```

3. **清理配置**
   ```bash
   sudo rm -rf /var/lib/mysql
   sudo rm -rf /etc/my.cnf
   sudo rm -rf /etc/my.cnf.d
   ```

4. **重新安装 MariaDB**
   ```bash
   sudo yum install -y mariadb-server mariadb-client
   sudo systemctl start mariadb
   sudo systemctl enable mariadb
   ```

5. **恢复数据**
   ```bash
   mysql -u root -p
   CREATE DATABASE banquet_order_system;
   CREATE USER 'leo'@'localhost' IDENTIFIED BY 'leo123';
   GRANT ALL PRIVILEGES ON banquet_order_system.* TO 'leo'@'localhost';
   FLUSH PRIVILEGES;
   exit;
   
   mysql -u leo -p banquet_order_system < banquet_order_system.sql
   ```

6. **恢复应用程序配置**
   - 恢复原始的 `database.ts` 配置

## 注意事项

1. **升级时机**：选择业务低峰期进行升级
2. **备份**：确保有完整的数据库备份
3. **测试**：在测试环境中先进行升级测试
4. **监控**：升级后密切监控系统运行状态
5. **文档**：记录整个升级过程，包括遇到的问题和解决方案
6. **网络问题**：确保服务器有稳定的网络连接
7. **YUM 仓库**：如果遇到 YUM 仓库问题，尝试使用备选安装方法

## 预期结果

- 成功升级到 MySQL 8.0
- 数据库服务正常运行
- 应用程序能够正常连接和操作数据库
- 所有功能正常工作