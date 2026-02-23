# Admin 管理后台文档

## 技术栈

- **Next.js**: 16.1.6 (App Router)
- **React**: 19.2.3
- **Tailwind CSS**: 4.x
- **Radix UI / Shadcn UI**: 组件库
- **Framer Motion**: 动画
- **SWR**: 数据请求
- **iron-session**: 会话管理
- **React Hook Form + Zod**: 表单验证

## 项目结构

```
admin/src/
├── app/                    # App Router 页面
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 仪表盘首页
│   ├── login/              # 登录页
│   ├── posts/              # 文章管理
│   │   ├── page.tsx        # 文章列表
│   │   ├── new/            # 新建文章
│   │   └── [id]/           # 编辑文章
│   ├── categories/         # 分类管理
│   ├── tags/               # 标签管理
│   ├── links/              # 友链管理
│   ├── media/              # 媒体库
│   ├── config/             # 网站配置
│   └── api/                # Next.js API Routes
│
├── components/
│   ├── providers.tsx       # 全局 Provider
│   ├── admin/              # 管理后台组件
│   │   ├── AdminLayout.tsx
│   │   ├── AdminGuard.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── ui/                 # UI 组件
│
├── lib/
│   ├── api-client.ts       # API 客户端
│   ├── session.ts          # 会话管理
│   └── utils.ts            # 工具函数
│
├── types/
│   └── index.ts            # 类型定义
│
└── middleware.ts           # 路由守卫
```

## 页面功能

### 仪表盘 (`/`)

- 统计卡片：文章、分类、标签、友链数量
- 最近文章列表
- 总访问量
- 快捷操作入口

### 文章管理 (`/posts`)

- 文章列表（搜索、筛选、分页）
- 新建/编辑文章
- Markdown 编辑器
- 封面图片上传
- 分类与标签选择
- 草稿/发布状态切换

### 分类管理 (`/categories`)

- 分类 CRUD
- 排序功能
- 层级结构

### 标签管理 (`/tags`)

- 标签 CRUD
- 使用统计

### 友链管理 (`/links`)

- 友链 CRUD
- 排序功能
- 状态管理

### 媒体库 (`/media`)

- 文件上传
- 文件列表
- 文件删除
- 图片预览

### 网站配置 (`/config`)

- **基础配置**: 标题、描述、Logo、站点 URL
- **首页背景**: 视频/图片背景、遮罩透明度
- **SEO 配置**: 关键词、OG 图片
- **页脚配置**: 版权、ICP 备案、公安备案
- **作者信息**: 名称、头像、简介、位置、邮箱
- **社交链接**: GitHub、Twitter、Bilibili 等图标选择
- **技能展示**: 技能名称、分类

## 认证机制

采用双重认证：

1. **iron-session**: Next.js 服务端会话
2. **JWT Token**: 与后端 API 通信

```
用户登录 → Next.js API Route → 调用后端 API → 获取 JWT Token
       → 存储到 HTTP-only Cookie → 后续请求自动携带
```

### 路由守卫

`middleware.ts` 检查 `auth_token` Cookie，未登录重定向到 `/login`。

## 环境变量

```env
# .env
NEXT_PUBLIC_API_URL=http://localhost:8080
SESSION_SECRET=your_session_secret
SESSION_PASSWORD=your_session_password_at_least_32_characters
```

## 开发指南

### 启动项目

```bash
cd admin
pnpm install
pnpm dev
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

### 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS
- 表单使用 React Hook Form + Zod 验证

## 社交图标支持

在网站配置页面的社交链接中，支持以下图标：

| 图标名称 | 说明 |
|---------|------|
| `github` | GitHub |
| `twitter` / `x` | Twitter/X |
| `bilibili` | 哔哩哔哩 |
| `weibo` | 新浪微博 |
| `zhihu` | 知乎 |
| `qq` | QQ |
| `wechat` | 微信 |
| `email` | 邮箱 |

## 常见问题

### 登录后 Token 无效

检查 JWT Token 是否正确存储在 Cookie 中，确认后端 JWT 配置一致。

### 上传文件失败

检查后端文件存储路径配置，确保目录存在且有写入权限。

### 配置保存不生效

前端配置更新后，需重启 Blog 服务或清除缓存才能看到效果。
