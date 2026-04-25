#!/bin/bash
# 数据库备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
DB_USER="banquet_user"
DB_NAME="banquet_order_system"

# 读取密码
if [ -f /root/.db_password ]; then
    DB_PASSWORD=$(cat /root/.db_password)
else
    echo "请先创建 /root/.db_password 文件并填入数据库密码"
    exit 1
fi

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "正在备份数据库..."
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/banquet_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "banquet_*.sql" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/banquet_$DATE.sql"
