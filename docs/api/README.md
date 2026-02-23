# API 后端文档

## 技术栈

- **Spring Boot**: 3.2.5
- **Java**: JDK 17
- **MyBatis Plus**: 3.5.5
- **Spring Security + JWT**: 安全认证
- **Knife4j**: API 文档
- **MySQL + Redis**: 数据存储

## 项目结构

```
api/src/main/java/com/blog/api/
├── config/                 # 配置类
│   ├── CorsConfig.java     # CORS 跨域配置
│   ├── Knife4jConfig.java  # API 文档配置
│   ├── MybatisPlusConfig.java
│   ├── RedisConfig.java
│   ├── SecurityConfig.java # Spring Security 配置
│   └── WebMvcConfig.java
│
├── controller/             # 控制器
│   ├── AuthController.java # 认证接口
│   ├── admin/              # 管理接口 (需认证)
│   │   ├── AdminCategoryController.java
│   │   ├── AdminConfigController.java
│   │   ├── AdminDashboardController.java
│   │   ├── AdminFriendLinkController.java
│   │   ├── AdminMediaController.java
│   │   ├── AdminPostController.java
│   │   └── AdminTagController.java
│   └── blog/               # 博客接口 (公开)
│       ├── BlogCategoryController.java
│       ├── BlogConfigController.java
│       ├── BlogFriendLinkController.java
│       ├── BlogPostController.java
│       └── BlogTagController.java
│
├── entity/                 # 实体类
│   ├── User.java
│   ├── Post.java
│   ├── Category.java
│   ├── Tag.java
│   ├── PostTag.java
│   ├── Media.java
│   ├── FriendLink.java
│   └── SiteConfig.java
│
├── service/                # 业务服务
│   ├── AuthService.java
│   ├── PostService.java
│   ├── CategoryService.java
│   ├── TagService.java
│   ├── ConfigService.java
│   ├── MediaService.java
│   ├── FriendLinkService.java
│   ├── DashboardService.java
│   ├── FileStorageService.java
│   └── TokenService.java
│
├── mapper/                 # MyBatis Mapper
├── dto/                    # 数据传输对象
│   ├── config/             # 配置 DTO
│   ├── request/            # 请求 DTO
│   └── response/           # 响应 DTO
│
├── security/               # 安全模块
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   └── UserDetailsServiceImpl.java
│
└── exception/              # 异常处理
    ├── BusinessException.java
    ├── ErrorCode.java
    └── GlobalExceptionHandler.java
```

## API 接口

### 认证接口 (`/api/auth`)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/register` | 用户注册 | ❌ |
| POST | `/login` | 用户登录 | ❌ |
| POST | `/logout` | 用户登出 | ✅ |
| GET | `/me` | 获取当前用户 | ✅ |

### 管理接口 (`/api/admin`)

需要 JWT Token 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/posts` | 文章列表/创建 |
| GET/PUT/DELETE | `/posts/{id}` | 文章详情/更新/删除 |
| GET/POST | `/categories` | 分类列表/创建 |
| GET/POST | `/tags` | 标签列表/创建 |
| GET/POST | `/links` | 友链列表/创建 |
| GET/POST | `/media/upload` | 文件上传 |
| GET/POST | `/config/site` | 站点配置 |
| GET | `/dashboard/stats` | 仪表盘统计 |

### 博客接口 (`/api/blog`)

公开接口，无需认证

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/posts` | 已发布文章列表 |
| GET | `/posts/{id}` | 文章详情 |
| GET | `/posts/slug/{slug}` | 根据 Slug 获取文章 |
| GET | `/categories` | 分类列表 |
| GET | `/categories/{slug}/posts` | 分类下的文章 |
| GET | `/tags` | 标签列表 |
| GET | `/tags/{slug}/posts` | 标签下的文章 |
| GET | `/links` | 友链列表 |
| GET | `/config/site` | 站点配置 |

## 数据模型

### 文章 (Post)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 主键 |
| title | String | 标题 |
| slug | String | URL 别名 |
| summary | String | 摘要 |
| content | String | 内容 (Markdown) |
| cover | String | 封面图片 |
| status | Integer | 状态: 0-草稿, 1-已发布, 2-归档 |
| viewCount | Integer | 浏览量 |
| categoryId | Long | 分类 ID |
| authorId | Long | 作者 ID |
| publishedAt | LocalDateTime | 发布时间 |

### 分类 (Category)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 主键 |
| name | String | 名称 |
| slug | String | URL 别名 |
| description | String | 描述 |
| parentId | Long | 父分类 ID |
| sortOrder | Integer | 排序 |

### 标签 (Tag)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 主键 |
| name | String | 名称 |
| slug | String | URL 别名 |

### 站点配置 (SiteConfig)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 主键 |
| configKey | String | 配置键 |
| configValue | String | 配置值 (JSON) |

配置键类型：
- `site_basic`: 基础配置
- `site_seo`: SEO 配置
- `site_footer`: 页脚配置
- `analytics`: 统计配置
- `author`: 作者信息
- `social_links`: 社交链接
- `skills`: 技能展示

## 错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户不存在 |
| 1002 | 用户名已存在 |
| 1101 | Token 过期 |
| 1102 | Token 无效 |
| 2001 | 文章不存在 |
| 2002 | Slug 已存在 |
| 3001 | 分类不存在 |
| 3002 | 分类下存在文章 |
| 4001 | 标签不存在 |

## 配置说明

### application.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog_db
    username: root
    password: your_password
  data:
    redis:
      host: localhost
      port: 6379

jwt:
  secret: your_jwt_secret_key
  expiration: 86400000  # 24小时

file:
  upload:
    path: ./uploads/
```

## 开发指南

### 启动项目

```bash
cd api
mvn spring-boot:run
```

### API 文档

启动后访问: http://localhost:8080/doc.html

### 运行测试

```bash
mvn test
```

### 打包部署

```bash
mvn clean package -DskipTests
java -jar target/blog-api-1.0.0.jar
```
