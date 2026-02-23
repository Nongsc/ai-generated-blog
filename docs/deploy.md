# Docker Compose 部署指南

## 前置要求

- Docker Desktop 已安装并运行
- 至少 4GB 可用内存
- 端口 3000, 3001, 8080, 3306, 6379 未被占用

## 快速启动

### 1. 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker.example .env

# 编辑配置（建议修改密码和密钥）
# Windows: notepad .env
# Mac/Linux: nano .env
```

### 2. 构建并启动服务

```bash
# 构建并启动所有服务（首次运行或代码更新后）
docker compose up -d --build

# 仅启动服务（无代码变更时）
docker compose up -d
```

### 3. 查看服务状态

```bash
docker compose ps
```

### 4. 查看日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f api
docker compose logs -f admin
docker compose logs -f blog
```

## 服务访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| **API 文档** | http://localhost:8080/doc.html | Knife4j API 文档 |
| **Admin 后台** | http://localhost:3000 | 管理后台 |
| **Blog 前台** | http://localhost:3001 | 博客前台 |
| **MySQL** | localhost:3306 | 数据库（用户: root） |
| **Redis** | localhost:6379 | 缓存服务 |

## 默认账号

首次启动后，数据库会自动创建默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

**⚠️ 生产环境请务必修改默认密码！**

## 常用命令

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（重置数据库）
docker compose down -v

# 重启特定服务
docker compose restart api

# 进入容器调试
docker compose exec api sh
docker compose exec admin sh
docker compose exec mysql mysql -uroot -p
```

## 数据持久化

数据存储在 Docker 数据卷中：
- `mysql_data`: MySQL 数据
- `redis_data`: Redis 数据
- `./uploads`: 上传文件

## 故障排查

### 服务启动失败

1. 检查端口占用：
   ```bash
   # Windows
   netstat -ano | findstr :8080
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

2. 查看服务日志：
   ```bash
   docker compose logs <service-name>
   ```

### 数据库连接失败

1. 确认 MySQL 容器健康：
   ```bash
   docker compose ps mysql
   ```

2. 检查数据库日志：
   ```bash
   docker compose logs mysql
   ```

### API 服务报错

1. 检查 JVM 内存：
   ```bash
   docker compose exec api ps aux
   ```

2. 调整内存限制（修改 docker-compose.yml 中的 JAVA_OPTS）

## 生产环境建议

1. **修改默认密码**：更新 `.env` 中的所有密码和密钥
2. **配置 HTTPS**：使用反向代理（如 Nginx/Caddy）配置 SSL
3. **备份数据**：定期备份 MySQL 数据卷
4. **资源限制**：在 docker-compose.yml 中添加资源限制
5. **日志管理**：配置日志驱动和轮转

## 单独构建镜像

```bash
# 构建 API 镜像
docker build -t sakura-api ./api

# 构建 Admin 镜像
docker build -t sakura-admin ./admin

# 构建 Blog 镜像
docker build -t sakura-blog ./blog
```
