// 文章元数据
export interface PostMeta {
  id: number | string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  cover?: string | null;
  excerpt: string;
  slug?: string;
  viewCount?: number;
}

// 文章内容
export interface Post extends PostMeta {
  content: string;
}

// 作者信息
export interface AuthorInfo {
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  email?: string;
  social: SocialLink[];
}

// 社交链接
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// 分类
export interface Category {
  name: string;
  slug: string;
  description?: string;
  count: number;
}

// 标签
export interface Tag {
  name: string;
  slug: string;
  count: number;
}

// 技能
export interface Skill {
  name: string;
  category: string;
}

// 博客配置
export interface BlogConfig {
  title: string;
  description: string;
  logo?: string;
  favicon?: string;
  // 首页背景配置
  backgroundType: 'video' | 'image' | 'none';
  backgroundUrl: string;
  overlayOpacity: number;
  author: AuthorInfo;
  categories: Category[];
  tags: Tag[];
  skills: Skill[];
}

// 页脚配置
export interface FooterConfig {
  copyright: string;
  icpNumber: string;
  icpUrl: string;
  policeNumber: string;
  policeUrl: string;
}

// SEO 配置
export interface SeoConfig {
  keywords: string[];
  ogImage: string;
  twitterCard: string;
  twitterSite: string;
}
