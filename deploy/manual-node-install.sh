#!/bin/bash
# 如果 NodeSource 脚本仍然失败，使用这个手动安装脚本

set -e

echo "正在手动安装 Node.js..."

# 下载 Node.js 18 LTS (使用国内镜像)
NODE_VERSION="18.20.4"
ARCH="x64"
NODE_URL="https://npmmirror.com/mirrors/node/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${ARCH}.tar.xz"

cd /tmp
echo "正在下载: $NODE_URL"
curl -L -o node.tar.xz "$NODE_URL"

# 解压
tar -xf node.tar.xz
cd node-v${NODE_VERSION}-linux-${ARCH}

# 复制到系统目录
cp -r bin/* /usr/local/bin/
cp -r lib/* /usr/local/lib/
cp -r include/* /usr/local/include/
cp -r share/* /usr/local/share/

# 验证安装
echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 配置 npm 镜像
npm config set registry https://registry.npmmirror.com

echo "Node.js 安装完成！"
