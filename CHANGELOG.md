# 更新日志

本文档遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 规范，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.0] - 2026-02-24

### 优化

#### API 后端
- **性能优化**：修复 N+1 查询问题，文章列表批量查询分类和标签
- **并发安全**：浏览量计数改用原子更新 SQL
- **代码重构**：提取 `SlugUtils` 工具类，消除重复代码
- **缓存优化**：`ConfigService` 添加 Redis 缓存（5 分钟 TTL）

#### Admin 管理后台
- **依赖清理**：移除 Prisma、mysql2、bcryptjs 等未使用的依赖（减少约 17.5MB）
- **统一缓存**：创建 `CacheManager` 缓存管理器
- **骨架屏**：添加 `Skeleton` 组件系列
- **错误处理**：添加 `ErrorBoundary` 错误边界组件

#### Blog 博客前台
- **统一缓存**：创建 `CacheManager` 缓存管理器
- **缓存策略**：站点配置、分类、标签、友链添加缓存（5 分钟 TTL）
- **骨架屏**：添加 `PostCardSkeleton`、`PostDetailSkeleton` 等组件
- **错误处理**：添加 `ErrorBoundary` 错误边界组件

#### 部署
- **Docker 优化**：更新 `docker-compose.yml`，添加资源限制
- **Dockerfile 优化**：移除 Admin 中 Prisma 相关步骤
- **文档整理**：`DEPLOY.md` 移动到 `docs/deploy.md`

### 修复
- `PostMapper` 接口改为静态类解决 MyBatis 映射问题
- Admin 媒体上传 API 路径错误修复

---

## [1.0.0] - 2026-02-24

### 新增

#### API 后端
- 用户认证模块（JWT Token）
- 文章管理 CRUD
- 分类管理 CRUD
- 标签管理 CRUD
- 友情链接管理 CRUD
- 媒体文件上传/管理
- 站点配置系统
- 仪表盘统计接口
- API 文档（Knife4j）

#### Admin 管理后台
- 登录/登出功能
- 仪表盘首页
- 文章管理页面（含 Markdown 编辑器）
- 分类管理页面
- 标签管理页面
- 友链管理页面
- 媒体库页面
- 网站配置页面
  - 基础配置
  - SEO 配置
  - 页脚配置
  - 作者信息
  - 社交链接（支持下拉选择图标）
  - 技能展示

#### Blog 博客前台
- 首页（全屏 Hero + 一言 API）
- 文章列表页
- 文章详情页（Markdown 渲染 + 代码高亮）
- 分类列表/详情页
- 标签列表/详情页
- 归档页面
- 友链页面
- 关于页面
- 响应式设计
- 社交图标（react-icons Simple Icons）

### 修复
- 文章详情页 404 问题（使用 API 替代本地文件）
- 分类/标签页面链接问题（添加 categorySlug 字段）
- 友链页站点 URL 问题（添加 siteUrl 配置字段）
- 归档页使用 API 数据
- 首页标题使用站点配置
- 社交图标显示问题（使用 react-icons）

---

## 版本说明

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正
