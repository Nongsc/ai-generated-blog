"use client";

import { Mail, ExternalLink } from "lucide-react";
import { 
  SiGithub, 
  SiX, 
  SiBilibili, 
  SiSinaweibo, 
  SiZhihu,
  SiTencentqq,
  SiWechat
} from "react-icons/si";
import { useBasicConfig, useFooterConfig, useSocialLinks } from "@/contexts/SiteConfigContext";

// 图标映射 - 使用 react-icons Simple Icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: SiGithub,
  twitter: SiX,
  x: SiX,
  bilibili: SiBilibili,
  weibo: SiSinaweibo,
  zhihu: SiZhihu,
  qq: SiTencentqq,
  wechat: SiWechat,
  email: Mail,
  mail: Mail,
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const basicConfig = useBasicConfig();
  const footerConfig = useFooterConfig();
  const socialLinks = useSocialLinks();

  const siteTitle = basicConfig?.title || "博客";
  const siteLogo = basicConfig?.logo;
  const siteDescription = basicConfig?.description || "个人博客";

  const copyright = footerConfig?.copyright || `${currentYear} ${siteTitle}. 用心创作.`;

  // 渲染社交图标
  const renderSocialIcon = (iconName: string) => {
    const iconKey = iconName.toLowerCase();
    const IconComponent = iconMap[iconKey];
    
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
    
    // 默认使用 ExternalLink
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <footer className="bg-muted/50 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_350)] to-[oklch(0.7_0.15_200)] flex items-center justify-center overflow-hidden">
              {siteLogo ? (
                <img src={siteLogo} alt={siteTitle} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{siteTitle.charAt(0)}</span>
              )}
            </div>
            <span className="font-semibold text-lg text-foreground">{siteTitle}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {siteDescription}
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                {renderSocialIcon(link.icon)}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright & ICP */}
        <div className="mt-8 pt-8 border-t border-border/50 space-y-2">
          <p className="text-center text-sm text-muted-foreground">{copyright}</p>

          {/* ICP & Police */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            {footerConfig?.icpNumber && (
              <a
                href={footerConfig.icpUrl || "https://beian.miit.gov.cn/"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {footerConfig.icpNumber}
              </a>
            )}
            {footerConfig?.policeNumber && (
              <a
                href={footerConfig.policeUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <img
                  src="https://img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png"
                  alt="公安备案"
                  className="w-4 h-4"
                />
                {footerConfig.policeNumber}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
