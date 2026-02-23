// Type Definitions for Blog Admin System

// ==================== User Types ====================
export interface User {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// ==================== Post Types ====================
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover: string | null;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  categories: Category[];
  tags: Tag[];
}

export interface PostFormData {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  cover?: string;
  status: PostStatus;
  categoryIds: number[];
  tagIds: number[];
}

export interface PostListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: PostStatus;
  categoryId?: number;
  tagId?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== Category Types ====================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  postCount?: number;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}

// ==================== Tag Types ====================
export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  postCount?: number;
}

export interface TagFormData {
  name: string;
  slug: string;
}

// ==================== Friend Link Types ====================
export interface FriendLink {
  id: number;
  name: string;
  url: string;
  avatar: string;
  description: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface FriendLinkFormData {
  name: string;
  url: string;
  avatar: string;
  description?: string;
  sortOrder?: number;
}

// ==================== Site Config Types ====================
export interface SiteConfig {
  id: number;
  key: string;
  value: string;
  updatedAt: Date;
}

export interface SiteConfigData {
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  authorLocation?: string;
  authorEmail?: string;
  socialLinks: SocialLink[];
  analyticsCode?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// ==================== Media Types ====================
export type StorageType = 'LOCAL' | 'CLOUD';

export interface Media {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  storageType: StorageType;
  createdAt: Date;
}

export interface UploadResult {
  success: boolean;
  data?: Media;
  error?: string;
}

// ==================== API Response Types ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==================== Session Types ====================
export interface SessionData {
  userId: number;
  username: string;
  isLoggedIn: boolean;
}
