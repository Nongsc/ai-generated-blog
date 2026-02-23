"use client";

import { MapPin, Mail, ExternalLink, Sparkles } from "lucide-react";
import { 
  SiGithub, 
  SiX, 
  SiBilibili, 
  SiSinaweibo, 
  SiZhihu,
  SiTencentqq,
  SiWechat
} from "react-icons/si";
import { useAuthorConfig, useSocialLinks, useSkills } from "@/contexts/SiteConfigContext";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

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

export default function AboutPage() {
  const author = useAuthorConfig();
  const socialLinks = useSocialLinks();
  const skills = useSkills();

  const authorName = author?.name || "作者";
  const authorAvatar = author?.avatar;
  const authorBio = author?.bio || "热爱分享的开发者";
  const authorLocation = author?.location;
  const authorEmail = author?.email;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/70 backdrop-blur-sm">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative p-8 sm:p-12">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20 overflow-hidden">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl sm:text-6xl font-bold text-white">
                      {authorName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Name & Bio */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {authorName}
                </h1>
                <div className="max-w-xl mb-4 text-muted-foreground">
                  <MarkdownRenderer content={authorBio} className="prose-sm prose-p:my-2 prose-p:leading-relaxed" />
                </div>

                {/* Location and Email */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  {authorLocation && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{authorLocation}</span>
                    </div>
                  )}
                  {authorEmail && (
                    <a
                      href={`mailto:${authorEmail}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{authorEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-8">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.icon.toLowerCase()];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200"
                    >
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-foreground" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-foreground" />
                      )}
                      <span className="text-sm font-medium text-foreground">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Skills/Interests */}
            {skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  技能与兴趣
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`px-4 py-2 rounded-xl text-sm border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-default ${
                        skill.category === 'tech'
                          ? 'bg-blue-500/5 border-blue-500/20'
                          : skill.category === 'life'
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-purple-500/5 border-purple-500/20'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            {authorEmail && (
              <div className="text-center sm:text-left pt-6 border-t border-white/10">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  联系我
                </h2>
                <p className="text-muted-foreground mb-4">
                  欢迎联系我进行合作或友好交流
                </p>
                <a href={`mailto:${authorEmail}`}>
                  <ShimmerButton className="px-8 py-3 rounded-xl">
                    发送消息
                  </ShimmerButton>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
