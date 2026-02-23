import { cookies } from 'next/headers';

// API 基础配置
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

// API 响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应格式
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 请求配置
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// 获取 Token
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

// 设置 Token
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  // 在开发环境或非 HTTPS 环境下不使用 secure
  const useSecure = process.env.NODE_ENV === 'production' && process.env.USE_HTTPS === 'true';
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// 清除 Token
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// 基础请求方法
async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requireAuth = true } = config;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 添加认证 Token
  if (requireAuth) {
    const token = await getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 检查响应状态
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const text = await response.text();
      if (text) {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      }
    } catch {
      // 忽略 JSON 解析错误
    }
    throw new Error(errorMessage);
  }

  // 解析响应
  const text = await response.text();
  if (!text) {
    throw new Error('Empty response from server');
  }

  const result: ApiResponse<T> = JSON.parse(text);

  if (result.code !== 200) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data;
}

// ==================== 认证 API ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const result: ApiResponse<AuthResponse> = await response.json();

  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || '登录失败');
  }

  // 保存 Token
  await setAuthToken(result.data.token);

  return result.data;
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/api/auth/logout', { method: 'POST' });
  } finally {
    await clearAuthToken();
  }
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
}

export async function getCurrentUser(): Promise<UserInfo> {
  return request<UserInfo>('/api/auth/me');
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
  tags: { id: number; name: string; slug: string }[];
}

export interface PostListResponse {
  content: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PostRequest {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  cover?: string;
  status?: number;
  categoryId?: number;
  tagIds?: number[];
}

export async function getPosts(params: {
  page?: number;
  size?: number;
  status?: number;
  categoryId?: number;
}): Promise<PostListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set('page', params.page.toString());
  if (params.size !== undefined) searchParams.set('size', params.size.toString());
  if (params.status !== undefined) searchParams.set('status', params.status.toString());
  if (params.categoryId !== undefined) searchParams.set('categoryId', params.categoryId.toString());

  const queryString = searchParams.toString();
  return request<PostListResponse>(`/api/admin/posts${queryString ? `?${queryString}` : ''}`);
}

export async function getPost(id: number): Promise<Post> {
  return request<Post>(`/api/admin/posts/${id}`);
}

export async function createPost(data: PostRequest): Promise<Post> {
  return request<Post>('/api/admin/posts', { method: 'POST', body: data });
}

export async function updatePost(id: number, data: PostRequest): Promise<Post> {
  return request<Post>(`/api/admin/posts/${id}`, { method: 'PUT', body: data });
}

export async function deletePost(id: number): Promise<void> {
  return request<void>(`/api/admin/posts/${id}`, { method: 'DELETE' });
}

// ==================== 分类 API ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/api/admin/categories');
}

export async function getCategory(id: number): Promise<Category> {
  return request<Category>(`/api/admin/categories/${id}`);
}

export async function createCategory(data: CategoryRequest): Promise<Category> {
  return request<Category>('/api/admin/categories', { method: 'POST', body: data });
}

export async function updateCategory(id: number, data: CategoryRequest): Promise<Category> {
  return request<Category>(`/api/admin/categories/${id}`, { method: 'PUT', body: data });
}

export async function deleteCategory(id: number): Promise<void> {
  return request<void>(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

// ==================== 标签 API ====================

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagRequest {
  name: string;
  slug?: string;
}

export async function getTags(): Promise<Tag[]> {
  return request<Tag[]>('/api/admin/tags');
}

export async function getTag(id: number): Promise<Tag> {
  return request<Tag>(`/api/admin/tags/${id}`);
}

export async function createTag(data: TagRequest): Promise<Tag> {
  return request<Tag>('/api/admin/tags', { method: 'POST', body: data });
}

export async function updateTag(id: number, data: TagRequest): Promise<Tag> {
  return request<Tag>(`/api/admin/tags/${id}`, { method: 'PUT', body: data });
}

export async function deleteTag(id: number): Promise<void> {
  return request<void>(`/api/admin/tags/${id}`, { method: 'DELETE' });
}

// ==================== 友情链接 API ====================

export interface FriendLink {
  id: number;
  name: string;
  url: string;
  avatar: string | null;
  description: string | null;
  sortOrder: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface FriendLinkRequest {
  name: string;
  url: string;
  avatar?: string;
  description?: string;
  sortOrder?: number;
}

export async function getFriendLinks(): Promise<FriendLink[]> {
  return request<FriendLink[]>('/api/admin/links');
}

export async function getFriendLink(id: number): Promise<FriendLink> {
  return request<FriendLink>(`/api/admin/links/${id}`);
}

export async function createFriendLink(data: FriendLinkRequest): Promise<FriendLink> {
  return request<FriendLink>('/api/admin/links', { method: 'POST', body: data });
}

export async function updateFriendLink(id: number, data: FriendLinkRequest): Promise<FriendLink> {
  return request<FriendLink>(`/api/admin/links/${id}`, { method: 'PUT', body: data });
}

export async function deleteFriendLink(id: number): Promise<void> {
  return request<void>(`/api/admin/links/${id}`, { method: 'DELETE' });
}

// ==================== 配置 API ====================

export interface Config {
  key: string;
  value: string;
  description?: string;
}

export interface ConfigRequest {
  key: string;
  value: string;
}

export async function getConfig(key?: string): Promise<Config | Config[]> {
  const endpoint = key ? `/api/admin/config?key=${key}` : '/api/admin/config';
  return request<Config | Config[]>(endpoint);
}

export async function saveConfig(data: ConfigRequest): Promise<Config> {
  return request<Config>('/api/admin/config', { method: 'POST', body: data });
}

// ==================== 媒体 API ====================

export interface Media {
  id: number;
  filename: string;
  originalFilename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploaderId: number;
  createdAt: string;
}

export interface MediaListResponse {
  content: Media[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function getMedia(params: {
  page?: number;
  size?: number;
  uploaderId?: number;
}): Promise<MediaListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set('page', params.page.toString());
  if (params.size !== undefined) searchParams.set('size', params.size.toString());
  if (params.uploaderId !== undefined) searchParams.set('uploaderId', params.uploaderId.toString());

  const queryString = searchParams.toString();
  return request<MediaListResponse>(`/api/admin/media${queryString ? `?${queryString}` : ''}`);
}

export async function getRecentMedia(limit: number = 10): Promise<Media[]> {
  return request<Media[]>(`/api/admin/media/recent?limit=${limit}`);
}

export async function uploadMedia(formData: FormData): Promise<Media> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/media/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const result: ApiResponse<Media> = await response.json();

  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || '上传失败');
  }

  return result.data;
}

export async function deleteMedia(id: number): Promise<void> {
  return request<void>(`/api/admin/media/${id}`, { method: 'DELETE' });
}

// ==================== 仪表盘 API ====================

export interface DashboardStats {
  postCount: number;
  categoryCount: number;
  tagCount: number;
  friendLinkCount: number;
  totalViewCount: number;
  recentPosts: {
    id: number;
    title: string;
    status: number;
    viewCount: number;
    publishedAt: string | null;
    createdAt: string;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/api/admin/dashboard/stats');
}

// ==================== 站点配置 API ====================

export interface SiteConfigResponse {
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

export async function getSiteConfig(): Promise<SiteConfigResponse> {
  return request<SiteConfigResponse>('/api/admin/config/site');
}

export async function saveSiteConfig(config: SiteConfigResponse): Promise<void> {
  return request<void>('/api/admin/config/site', { method: 'POST', body: config });
}
