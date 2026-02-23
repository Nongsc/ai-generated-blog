# Blog 博客前台文档

## 技术栈

- **Next.js**: 16.1.6 (App Router)
- **React**: 19.2.3
- **Tailwind CSS**: 4.x
- **Radix UI / Shadcn UI**: 组件库
- **Framer Motion**: 动画
- **react-markdown**: Markdown 渲染
- **react-icons**: 图标库 (Simple Icons)
- **一言 API**: 随机名言

## 项目结构

```
blog/src/
├── app/                    # App Router 页面
│   ├── layout.tsx          # 根布局 (含 Header、Footer)
│   ├── page.tsx            # 首页
│   ├── posts/
│   │   ├── page.tsx        # 文章列表
│   │   └── [id]/page.tsx   # 文章详情
│   ├── categories/
│   │   ├── page.tsx        # 分类列表
│   │   └── [name]/page.tsx # 分类文章
│   ├── tags/
│   │   ├── page.tsx        # 标签列表
│   │   └── [name]/page.tsx # 标签文章
│   ├── archives/page.tsx   # 归档页面
│   ├── links/page.tsx      # 友链页面
│   └── about/page.tsx      # 关于页面
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # 导航栏
│   │   └── Footer.tsx      # 页脚
│   ├── home/
│   │   └── HeroSection.tsx # 首页 Hero 区域
│   ├── common/
│   │   ├── GlobalBackground.tsx
│   │   ├── VideoBackground.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostCardHorizontal.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── CodeBlock.tsx
│   └── ui/                 # UI 组件
│
├── lib/
│   ├── api-client.ts       # API 客户端
│   └── utils.ts            # 工具函数
│
├── contexts/
│   └── SiteConfigContext.tsx  # 站点配置 Context
│
└── types/
    └── index.ts            # 类型定义
```

## 页面功能

### 首页 (`/`)

- 全屏 Hero 区域
  - 动态背景（视频/图片）
  - 站点标题（从配置获取）
  - 一言 API 随机名言
- 最新文章列表
- 响应式设计

### 文章列表 (`/posts`)

- 分页展示
- 文章卡片预览
- 封面图片

### 文章详情 (`/posts/[id]`)

- Markdown 渲染
- 代码高亮 (rehype-highlight)
- 分类/标签链接
- 浏览量统计

### 分类页面 (`/categories`)

- 分类列表
- 分类下文章数统计
- 点击进入分类文章

### 标签页面 (`/tags`)

- 标签云展示
- 点击进入标签文章

### 归档页面 (`/archives`)

- 按时间线展示文章
- 年份分组

### 友链页面 (`/links`)

- 本站信息（从配置获取站点 URL）
- 友情链接列表

### 关于页面 (`/about`)

- 作者信息
- 社交链接
- 技能标签

## 站点配置

通过 `SiteConfigContext` 提供全局配置：

```typescript
interface SiteConfig {
  basic: SiteBasicConfig;      // 基础配置
  seo: SiteSeoConfig;          // SEO 配置
  analytics: AnalyticsConfig;  // 统计配置
  footer: FooterConfig;        // 页脚配置
  author: AuthorConfig;        // 作者信息
  socialLinks: SocialLink[];   // 社交链接
  skills: Skill[];             // 技能列表
}
```

## 社交图标

使用 `react-icons` 的 Simple Icons，支持：

| 配置值 | 图标 |
|--------|------|
| `github` | GitHub |
| `twitter` / `x` | Twitter/X |
| `bilibili` | 哔哩哔哩 |
| `weibo` | 新浪微博 |
| `zhihu` | 知乎 |
| `qq` | QQ |
| `wechat` | 微信 |
| `email` | 邮箱 |

## 环境变量

```env
# .env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## SEO 配置

### 动态 Metadata

```typescript
// app/layout.tsx
export async function generateMetadata() {
  const config = await getSiteConfig();
  return {
    title: config.basic.title,
    description: config.basic.description,
    // ...
  };
}
```

### 统计集成

支持：
- Google Analytics
- 百度统计

在 Admin 配置页面填写统计 ID 即可启用。

## 开发指南

### 启动项目

```bash
cd blog
pnpm install
pnpm dev
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

### 配置更新

站点配置修改后，需要重启服务或刷新页面才能看到效果（开发环境不缓存配置）。

## 一言 API

首页使用一言 API 获取随机名言：

- API: `https://v1.hitokoto.cn`
- 返回格式: JSON
- 包含句子内容、来源、类型等信息

## 响应式设计

- 移动端优先
- 导航栏汉堡菜单
- 文章卡片自适应
- 代码块横向滚动

## 性能优化

- Next.js 图片优化
- 代码分割
- 配置缓存（生产环境）
- API 响应缓存
