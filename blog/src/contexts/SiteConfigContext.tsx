'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSiteConfig, SiteConfig } from '@/lib/api-client';

interface SiteConfigContextValue {
  config: SiteConfig | null;
  loading: boolean;
  error: Error | null;
}

const SiteConfigContext = createContext<SiteConfigContextValue>({
  config: null,
  loading: true,
  error: null,
});

interface SiteConfigProviderProps {
  children: ReactNode;
  initialConfig?: SiteConfig | null;
}

export function SiteConfigProvider({ children, initialConfig }: SiteConfigProviderProps) {
  const [config, setConfig] = useState<SiteConfig | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 如果已有初始配置，则不再请求
    if (initialConfig) {
      return;
    }

    getSiteConfig()
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [initialConfig]);

  return (
    <SiteConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

// 便捷 hooks
export function useBasicConfig() {
  const { config } = useSiteConfig();
  return config?.basic;
}

export function useAuthorConfig() {
  const { config } = useSiteConfig();
  return config?.author;
}

export function useFooterConfig() {
  const { config } = useSiteConfig();
  return config?.footer;
}

export function useSocialLinks() {
  const { config } = useSiteConfig();
  return config?.socialLinks || [];
}

export function useSkills() {
  const { config } = useSiteConfig();
  return config?.skills || [];
}

export function useSeoConfig() {
  const { config } = useSiteConfig();
  return config?.seo;
}
