#!/bin/bash
# 宴席信息管理系统 - 一键部署脚本
# 使用方法: chmod +x setup.sh && ./setup.sh

set -e

echo "============================================="
echo "  宴席信息管理系统 - 一键部署"
echo "============================================="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 root 用户运行此脚本"
    exit 1
fi

# 更新系统
echo "正在更新系统..."
apt update && apt upgrade -y

# 安装必要的依赖
echo "正在安装必要的依赖..."
apt install -y curl git ufw ca-certificates

# 安装 Node.js (使用 NodeSource 官方源，更稳定)
echo "正在安装 Node.js..."
if ! command -v node &> /dev/null; then
    # 下载并运行 NodeSource 安装脚本
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    echo "Node.js 版本: $(node -v)"
    echo "npm 版本: $(npm -v)"
fi

# 配置 npm 使用国内镜像源
echo "正在配置 npm 镜像源..."
npm config set registry https://registry.npmmirror.com

# 安装 MySQL
echo "正在安装 MySQL..."
if ! command -v mysql &> /dev/null; then
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
fi

# 安装 Nginx
echo "正在安装 Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi

# 安装 PM2
echo "正在安装 PM2..."
npm install -g pm2

echo ""
echo "============================================="
echo "  基础环境安装完成！"
echo "============================================="
echo ""
echo "接下来请执行以下步骤："
echo "1. 配置 MySQL 数据库"
echo "2. 上传项目文件"
echo "3. 配置后端环境"
echo "4. 构建并启动服务"
echo ""
echo "详细文档请查看 deploy/README.md"
echo ""
