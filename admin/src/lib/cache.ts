/**
 * 统一缓存管理器 (Admin)
 * 支持内存缓存和过期时间
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 2 * 60 * 1000; // 默认 2 分钟（Admin 数据变化更频繁）

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  deleteByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cache = new CacheManager();

// Admin 缓存键常量
export const CACHE_KEYS = {
  DASHBOARD_STATS: 'admin:dashboard',
  CATEGORIES: 'admin:categories',
  TAGS: 'admin:tags',
  FRIEND_LINKS: 'admin:links',
  SITE_CONFIG: 'admin:config',
} as const;
