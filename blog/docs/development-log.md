# 开发历史

## 2025-02-22 - 项目初始化

### 完成内容

1. **环境检查**
   - Node.js: v22.12.0
   - npm: 10.9.0
   - pnpm: 10.24.0
   - Git: 2.31.0

2. **项目创建**
   - 创建 Next.js 15 项目 (App Router)
   - 配置 TypeScript
   - 配置 Tailwind CSS 4
   - 初始化 ESLint

3. **依赖安装**
   - react-markdown: Markdown 渲染
   - remark-gfm: GitHub Flavored Markdown 支持
   - rehype-highlight: 代码高亮
   - gray-matter: frontmatter 解析
   - lucide-react: 图标库
   - framer-motion: 动画库
   - clsx, tailwind-merge: 样式工具

4. **Magic UI 组件安装**
   - Marquee: 滚动展示组件
   - Bento Grid: 卡片网格布局
   - Shimmer Button: 微光按钮
   - Border Beam: 边框光束效果
   - Text Animate: 文字动画

5. **目录结构创建**
   - src/types: 类型定义
   - src/data: 内容数据
   - src/components/layout: 布局组件
   - src/components/common: 通用组件
   - public/images: 图片资源
   - docs: 文档

6. **核心文件创建**
   - 类型定义 (src/types/index.ts)
   - 博客配置 (src/data/config/blog.ts)
   - 示例文章 (3篇)
   - 全局样式 (二次元清新配色)

### 配色方案

采用二次元清新柔和风格：
- Primary: 樱花粉
- Secondary: 天空蓝
- Accent: 薄荷绿
- Background: 柔白色

---

## 2025-02-22 - 布局组件开发

### 完成内容

1. **Header 组件**
   - 固定顶部导航栏
   - 半透明毛玻璃背景
   - 响应式设计（桌面/移动端）
   - 平滑过渡动画

2. **Footer 组件**
   - 品牌信息展示
   - 导航链接
   - 社交媒体链接
   - 版权信息

3. **根布局集成**
   - 集成 Header 和 Footer
   - 设置主要内容区域高度
   - 更新 metadata

---

## 2025-02-22 - Markdown 工具开发

### 完成内容

1. **文章解析工具 (src/lib/posts.ts)**
   - getAllPosts: 获取所有文章元数据
   - getPostById: 根据 ID 获取文章内容
   - getAllCategories: 获取所有分类
   - getAllTags: 获取所有标签
   - getPostsByCategory: 根据分类筛选文章
   - getPostsByTag: 根据标签筛选文章

2. **Markdown 渲染组件**
   - react-markdown 配置
   - remark-gfm 集成
   - rehype-highlight 代码高亮
   - 自定义样式

3. **代码高亮样式**
   - 明亮主题
   - 暗黑主题支持

---

## 2025-02-22 - 首页开发

### 完成内容

1. **Hero Section**
   - 渐变背景装饰
   - 博客标题和描述
   - CTA 按钮（Shimmer Button）
   - 动画效果

2. **Marquee Section**
   - Magic UI Marquee 组件
   - 关键词滚动展示

3. **Latest Posts Section**
   - 文章卡片网格布局
   - 响应式设计

4. **Categories Section**
   - 分类卡片展示
   - 渐变背景效果

---

## 2025-02-22 - 文章详情页开发

### 完成内容

1. **文章列表页面 (/posts)**
   - 文章网格布局
   - 空状态处理

2. **文章详情页面 (/posts/[id])**
   - 返回导航
   - 文章头部（分类、标题、日期、标签）
   - 封面图片
   - Markdown 内容渲染
   - 相关文章推荐
   - 静态生成 (generateStaticParams)

---

## 2025-02-22 - 分类和标签页面开发

### 完成内容

1. **分类列表页面 (/categories)**
   - 分类网格展示
   - 文章计数

2. **分类详情页面 (/categories/[name])**
   - 返回导航
   - 分类信息展示
   - 文章列表

3. **标签列表页面 (/tags)**
   - 标签云展示
   - 基于数量的尺寸变化

4. **标签详情页面 (/tags/[name])**
   - 返回导航
   - 标签信息展示
   - 文章列表

---

## 2025-02-22 - 关于我页面开发

### 完成内容

1. **个人资料卡片**
   - 渐变背景
   - 头像展示
   - 个人信息
   - 位置和邮箱

2. **社交链接**
   - GitHub、Twitter、Bilibili
   - 图标和链接

3. **技能/兴趣展示**
   - 标签云形式
   - 悬停效果

4. **联系区域**
   - CTA 按钮
   - Shimmer Button 效果

---

## 构建验证

项目成功构建，生成以下路由：
- `/` - 首页
- `/about` - 关于我页面
- `/categories` - 分类列表
- `/categories/[name]` - 分类详情
- `/posts` - 文章列表
- `/posts/[id]` - 文章详情
- `/tags` - 标签列表
- `/tags/[name]` - 标签详情

所有页面均为静态生成或 SSG。

---

## 2025-02-23 - 站点中文化

### 完成内容

1. **语言设置**
   - `layout.tsx`: `lang="en"` → `lang="zh-CN"`
   - metadata 标题和描述中文化

2. **导航中文化**
   - Header: Home→首页, Categories→分类, About→关于
   - Footer: 导航链接和品牌名称中文化

3. **首页文本中文化**
   - Hero 区域: 欢迎语、博客名称、描述
   - CTA 按钮: 浏览文章、关于我
   - 关键词: 技术、动漫、生活、学习、编程、设计
   - 分类区域: 按分类浏览、查看全部

4. **关于页面中文化**
   - 技能兴趣标题
   - 联系我区域
   - 表单按钮

5. **文章详情页中文化**
   - 返回文章列表
   - 相关文章

---

## 2025-02-23 - 图片资源替换

### 完成内容

将三篇示例文章的封面图片替换为用户提供的动漫风格图片：

| 文章 | 原封面 | 新封面 |
|------|--------|--------|
| getting-started-with-nextjs | nextjs-cover.jpg | 164393-ka_tong (卡通自然光感) |
| spring-anime-recommendations | anime-spring.jpg | 178029-mitsuha (你的名字风格) |
| typescript-advanced-tips | typescript-tips.jpg | 177118-dong_hua_pian (动漫蓝光) |

---

## 2025-02-23 - Markdown 渲染修复

### 问题描述

文章详情页 Markdown 内容没有正确渲染样式，代码块、标题、列表等缺少样式。

### 解决方案

1. **安装依赖**
   ```
   pnpm add @tailwindcss/typography
   ```

2. **配置插件** (`globals.css`)
   ```css
   @plugin "@tailwindcss/typography";
   ```

3. **添加代码高亮样式**
   - 自定义 `.hljs` 类样式
   - 使用项目配色方案（樱花粉、天空蓝、薄荷绿）
   - 支持关键字、字符串、注释、函数等语法高亮

### 修复效果

- 标题 (h1-h6) 正确显示层级样式
- 段落和列表有合适的间距
- 代码块有语法高亮
- 引用块有左边框和背景
- 链接有主题色

---

## 2025-02-23 - 代码块复制功能

### 完成内容

1. **新建 CodeBlock 组件** (`src/components/common/CodeBlock.tsx`)
   - 带复制按钮的代码块容器
   - 使用 `navigator.clipboard` API
   - 复制状态反馈（图标切换）
   - 2 秒后自动恢复状态

2. **更新 MarkdownRenderer**
   - 替换原有的 `pre` 组件
   - 集成 CodeBlock 组件

### 功能特性

- 鼠标悬停显示复制按钮
- 点击复制后显示 ✓ 图标
- 按钮样式与主题一致
- 支持所有代码块类型

---

## 2025-02-23 - 首页重构与视频背景

### 完成内容

1. **移除 Marquee 组件**
   - 删除首页滚动关键词展示区域
   - Hero 区域直接衔接最新文章区域

2. **添加视频背景组件** (`src/components/common/VideoBackground.tsx`)
   - 全屏视频背景
   - 自动播放、循环播放
   - 可配置遮罩层透明度
   - 渐变遮罩提升文字可读性

3. **添加音量控制功能**
   - 右下角音量切换按钮
   - 初始静音（符合浏览器自动播放策略）
   - 点击切换静音/取消静音
   - 状态图标同步显示

4. **Hero Section 重构**
   - 全屏布局 (`min-h-screen`)
   - 视频背景覆盖导航栏区域
   - 文字颜色改为白色
   - 按钮添加毛玻璃效果
   - 拆分为独立客户端组件 (`src/components/home/HeroSection.tsx`)

### 导航栏优化

1. **透明度动态调整**
   - 首页 Hero 区域：背景透明，文字白色
   - 滚动超出 Hero 区域或其他页面：背景 60% 透明度

2. **导航项更新**
   - 新增：标签、归档、友链
   - 完整导航：首页、分类、标签、归档、友链、关于

---

## 2025-02-23 - 新增页面

### 归档页面 (`/archives`)

- 按年月时间线展示所有文章
- 文章数量统计
- 时间线布局设计

### 友链页面 (`/links`)

- 卡片式友链展示
- 本站信息展示
- 友链申请说明

---

## 2025-02-23 - 标签与分类页汉化

### 完成内容

1. **标签页面** (`/tags`, `/tags/[name]`)
   - 标题：标签
   - 描述：按标签浏览文章
   - 返回按钮：返回标签列表
   - 文章数：X 篇文章
   - 空状态提示中文化

2. **分类页面** (`/categories`, `/categories/[name]`)
   - 标题：分类
   - 描述：按主题浏览文章
   - 返回按钮：返回分类列表
   - 文章数：X 篇文章
   - 空状态提示中文化

---

## 2025-02-23 - 标签与分类页样式优化

### 完成内容

1. **标签页面标签云样式**
   - 改用胶囊药丸样式 (`rounded-full`)
   - 渐变背景色 (8 种颜色循环)
   - 动态字号：文章越多字号越大
   - 悬停放大效果 (`hover:scale-105`)
   - 标签图标 (`Tag`)
   - 移除外层容器背景边框

2. **分类页面同步胶囊效果**
   - 与标签页面保持一致的设计风格
   - 使用 `Folder` 图标
   - 渐变背景 + 动态字号

---

## 2025-02-23 - 页脚精简

### 完成内容

1. **移除导航链接**
   - 删除页脚中的站点导航区块
   - 保留品牌 Logo、简介、社交链接、版权信息

---

## 2025-02-23 - 图片显示优化

### 问题描述

首页文章列表和文章详情页中的封面图片显示不完整。

### 解决方案

1. **首页文章列表 (`PostCardHorizontal`)**
   - 使用固定宽高比 `aspect-[4/3]`
   - 保持 `object-cover` 填充效果
   - 封面图左侧占 50%，高度自适应

2. **文章详情页封面图**
   - `object-cover` → `object-contain`
   - 添加 `bg-muted/30` 背景色填充空白区域
   - 调整为动态高度 (`min-h`)

3. **Markdown 内容图片**
   - 添加 `not-prose` 类避免 prose 样式冲突
   - 保证图片等比例缩放
