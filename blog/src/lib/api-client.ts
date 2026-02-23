// API 基础配置 - 直接访问后端 API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 导入缓存管理器
import { cache, CACHE_KEYS } from './cache';

// API 响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 请求配置
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

// 基础请求方法
async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = config;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data;
}

// ==================== 站点配置 API ====================

export interface SiteConfig {
  basic: SiteBasicConfig;
  seo: SiteSeoConfig;
  analytics: SiteAnalyticsConfig;
  footer: SiteFooterConfig;
  author: AuthorConfig;
  socialLinks: SocialLinkConfig[];
  skills: SkillConfig[];
}

export interface SiteBasicConfig {
  title: string;
  description: string;
  logo: string;
  favicon: string;
  siteUrl: string;
  backgroundType: 'video' | 'image' | 'none';
  backgroundUrl: string;
  overlayOpacity: number;
}

export interface SiteSeoConfig {
  keywords: string[];
  ogImage: string;
  twitterCard: string;
  twitterSite: string;
}

export interface SiteAnalyticsConfig {
  googleAnalyticsId: string;
  baiduTongjiId: string;
}

export interface SiteFooterConfig {
  copyright: string;
  icpNumber: string;
  icpUrl: string;
  policeNumber: string;
  policeUrl: string;
}

export interface AuthorConfig {
  name: string;
  avatar: string;
  bio: string;
  location: string;
  email: string;
}

export interface SocialLinkConfig {
  name: string;
  url: string;
  icon: string;
}

export interface SkillConfig {
  name: string;
  category: string;
}

// 配置缓存（使用统一缓存管理器）
const CONFIG_TTL = 5 * 60 * 1000; // 5 分钟

export async function getSiteConfig(): Promise<SiteConfig> {
  return cache.getOrSet(
    CACHE_KEYS.SITE_CONFIG,
    () => request<SiteConfig>('/api/blog/config/site'),
    CONFIG_TTL
  );
}

// 清除配置缓存
export function clearConfigCache() {
  cache.delete(CACHE_KEYS.SITE_CONFIG);
}

// ==================== 文章 API ====================

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  cover: string | null;
  status: number;
  viewCount: number;
  categoryId: number | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  tags: { id: number; name: string; slug: string }[];
}

export interface PostListResponse {
  content: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function getPosts(params: {
  page?: number;
  size?: number;
  status?: number;
  categoryId?: number;
  tagId?: number;
}): Promise<PostListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set('page', params.page.toString());
  if (params.size !== undefined) searchParams.set('size', params.size.toString());
  if (params.status !== undefined) searchParams.set('status', params.status.toString());
  if (params.categoryId !== undefined) searchParams.set('categoryId', params.categoryId.toString());
  if (params.tagId !== undefined) searchParams.set('tagId', params.tagId.toString());

  const queryString = searchParams.toString();
  return request<PostListResponse>(`/api/blog/posts${queryString ? `?${queryString}` : ''}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return request<Post>(`/api/blog/posts/slug/${slug}`);
}

export async function getPostById(id: number): Promise<Post> {
  return request<Post>(`/api/blog/posts/${id}`);
}

// ==================== 分类 API ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export async function getCategories(): Promise<Category[]> {
  return cache.getOrSet(
    CACHE_KEYS.CATEGORIES,
    () => request<Category[]>('/api/blog/categories'),
    CONFIG_TTL
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return request<Category>(`/api/blog/categories/${slug}`);
}

// ==================== 标签 API ====================

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export async function getTags(): Promise<Tag[]> {
  return cache.getOrSet(
    CACHE_KEYS.TAGS,
    () => request<Tag[]>('/api/blog/tags'),
    CONFIG_TTL
  );
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return request<Tag>(`/api/blog/tags/${slug}`);
}

// ==================== 友链 API ====================

export interface FriendLink {
  id: number;
  name: string;
  url: string;
  avatar: string | null;
  description: string | null;
}

export async function getFriendLinks(): Promise<FriendLink[]> {
  return cache.getOrSet(
    CACHE_KEYS.FRIEND_LINKS,
    () => request<FriendLink[]>('/api/blog/links'),
    CONFIG_TTL
  );
}
