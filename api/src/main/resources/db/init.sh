#!/bin/bash
# ===========================================
# 数据库初始化检查脚本
# ===========================================
# 此脚本检查数据库是否已初始化，如果没有则执行初始化
# Docker Compose 的 initdb 脚本只在数据目录为空时执行
# 此脚本可手动运行以重新初始化
# ===========================================

set -e

MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-root123}"
MYSQL_DATABASE="${MYSQL_DATABASE:-blog_db}"

echo "🔍 检查数据库连接..."

# 等待 MySQL 就绪
until mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1" &> /dev/null; do
    echo "⏳ 等待 MySQL 启动..."
    sleep 2
done

echo "✅ MySQL 已就绪"

# 检查表是否存在
TABLE_COUNT=$(mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -N -e \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$MYSQL_DATABASE'")

if [ "$TABLE_COUNT" -eq 0 ]; then
    echo "📊 数据库未初始化，正在执行初始化脚本..."
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < /docker-entrypoint-initdb.d/schema.sql
    echo "✅ 数据库初始化完成"
else
    echo "✅ 数据库已初始化（共 $TABLE_COUNT 张表）"
fi

echo ""
echo "📝 默认管理员账户："
echo "   用户名: admin"
echo "   密码: admin123"
echo "   ⚠️  生产环境请立即修改默认密码！"
