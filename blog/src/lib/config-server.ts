// 服务端配置获取（用于 generateMetadata）
import { SiteConfig } from './api-client';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

let cachedConfig: SiteConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function getServerSiteConfig(): Promise<SiteConfig | null> {
  // Check cache
  if (cachedConfig && Date.now() - cacheTime < CACHE_TTL) {
    return cachedConfig;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/config/site`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[config-server] Response not OK:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    cachedConfig = result.data;
    cacheTime = Date.now();

    return cachedConfig;
  } catch (error) {
    console.error('[config-server] Failed to fetch site config:', error);
    return null;
  }
}

// 清除缓存
export function clearServerConfigCache() {
  cachedConfig = null;
  cacheTime = 0;
}
