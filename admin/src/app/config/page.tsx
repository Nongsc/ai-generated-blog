'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Save,
  Globe,
  User,
  Share2,
  Search,
  BarChart3,
  FileText,
  Code,
  Link2,
  Plus,
  Trash2,
  Settings,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/toast';

// Markdown 编辑器（动态导入避免 SSR 问题）
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

// ==================== 类型定义 ====================

interface SiteBasicConfig {
  title: string;
  description: string;
  logo: string;
  favicon: string;
  siteUrl: string;
  backgroundType: 'video' | 'image' | 'none';
  backgroundUrl: string;
  overlayOpacity: number;
}

interface SiteSeoConfig {
  keywords: string[];
  ogImage: string;
  twitterCard: string;
  twitterSite: string;
}

interface SiteAnalyticsConfig {
  googleAnalyticsId: string;
  baiduTongjiId: string;
}

interface SiteFooterConfig {
  copyright: string;
  icpNumber: string;
  icpUrl: string;
  policeNumber: string;
  policeUrl: string;
}

interface AuthorConfig {
  name: string;
  avatar: string;
  bio: string;
  location: string;
  email: string;
}

interface SocialLinkConfig {
  name: string;
  url: string;
  icon: string;
}

interface SkillConfig {
  name: string;
  category: string;
}

interface SiteConfigResponse {
  basic: SiteBasicConfig;
  seo: SiteSeoConfig;
  analytics: SiteAnalyticsConfig;
  footer: SiteFooterConfig;
  author: AuthorConfig;
  socialLinks: SocialLinkConfig[];
  skills: SkillConfig[];
}

// ==================== 默认值 ====================

const defaultConfig: SiteConfigResponse = {
  basic: { title: '', description: '', logo: '', favicon: '', siteUrl: '', backgroundType: 'none', backgroundUrl: '', overlayOpacity: 0.5 },
  seo: { keywords: [], ogImage: '', twitterCard: '', twitterSite: '' },
  analytics: { googleAnalyticsId: '', baiduAnalyticsId: '' },
  footer: { copyright: '', icpNumber: '', icpUrl: '', policeNumber: '', policeUrl: '' },
  author: { name: '', avatar: '', bio: '', location: '', email: '' },
  socialLinks: [],
  skills: [],
};

type TabId = 'basic' | 'seo' | 'analytics' | 'footer' | 'author' | 'social' | 'skills';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'basic', label: '站点设置', icon: Globe },
  { id: 'seo', label: 'SEO 配置', icon: Search },
  { id: 'analytics', label: '统计分析', icon: BarChart3 },
  { id: 'footer', label: '页脚设置', icon: FileText },
  { id: 'author', label: '作者信息', icon: User },
  { id: 'social', label: '社交链接', icon: Share2 },
  { id: 'skills', label: '技能标签', icon: Code },
];

export default function ConfigPage() {
  const { success, error } = useToast();
  const [config, setConfig] = useState<SiteConfigResponse>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('basic');

  // 新增项
  const [newSocial, setNewSocial] = useState<SocialLinkConfig>({ name: '', url: '', icon: '' });
  const [newSkill, setNewSkill] = useState<SkillConfig>({ name: '', category: 'tech' });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config/site');
      const data = await res.json();
      if (data.success && data.data) {
        setConfig({
          basic: { ...defaultConfig.basic, ...data.data.basic },
          seo: { ...defaultConfig.seo, ...data.data.seo, keywords: data.data.seo?.keywords || [] },
          analytics: { ...defaultConfig.analytics, ...data.data.analytics },
          footer: { ...defaultConfig.footer, ...data.data.footer },
          author: { ...defaultConfig.author, ...data.data.author },
          socialLinks: data.data.socialLinks || [],
          skills: data.data.skills || [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        success('配置保存成功！');
      } else {
        error('保存失败');
      }
    } catch (err) {
      console.error('Save error:', err);
      error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // ==================== 辅助函数 ====================

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setConfig((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords: [...prev.seo.keywords, newKeyword.trim()] },
    }));
    setNewKeyword('');
  };

  const removeKeyword = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords: prev.seo.keywords.filter((_, i) => i !== index) },
    }));
  };

  const addSocial = () => {
    if (!newSocial.name || !newSocial.url) return;
    setConfig((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocial],
    }));
    setNewSocial({ name: '', url: '', icon: '' });
  };

  const removeSocial = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setConfig((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setNewSkill({ name: '', category: 'tech' });
  };

  const removeSkill = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // ==================== 渲染函数 ====================

  const renderInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder?: string,
    type: string = 'text'
  ) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
        placeholder={placeholder}
      />
    </div>
  );

  const renderTextarea = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder?: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
        placeholder={placeholder}
      />
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">网站配置</h1>
            <p className="text-muted-foreground">管理您的博客设置</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium hover:from-pink-500 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存更改'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          {/* 站点设置 */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {renderInput('站点标题', config.basic.title, (v) =>
                setConfig((p) => ({ ...p, basic: { ...p.basic, title: v } }))
              )}
              {renderTextarea('站点描述', config.basic.description, (v) =>
                setConfig((p) => ({ ...p, basic: { ...p.basic, description: v } }))
              )}
              {renderInput('Logo URL', config.basic.logo, (v) =>
                setConfig((p) => ({ ...p, basic: { ...p.basic, logo: v } })),
                'https://example.com/logo.png'
              )}
              {renderInput('Favicon URL', config.basic.favicon, (v) =>
                setConfig((p) => ({ ...p, basic: { ...p.basic, favicon: v } })),
                'https://example.com/favicon.ico'
              )}
              {renderInput('站点 URL', config.basic.siteUrl, (v) =>
                setConfig((p) => ({ ...p, basic: { ...p.basic, siteUrl: v } })),
                'https://your-domain.com'
              )}

              {/* 首页背景配置 */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">首页背景</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">背景类型</label>
                    <select
                      value={config.basic.backgroundType}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          basic: { ...p.basic, backgroundType: e.target.value as 'video' | 'image' | 'none' }
                        }))
                      }
                      className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="none">无背景</option>
                      <option value="video">视频背景</option>
                      <option value="image">图片背景</option>
                    </select>
                  </div>

                  {(config.basic.backgroundType === 'video' || config.basic.backgroundType === 'image') && (
                    <>
                      {renderInput(
                        config.basic.backgroundType === 'video' ? '视频 URL' : '图片 URL',
                        config.basic.backgroundUrl,
                        (v) => setConfig((p) => ({ ...p, basic: { ...p.basic, backgroundUrl: v } })),
                        config.basic.backgroundType === 'video'
                          ? '/video/background.mp4 或 https://example.com/video.mp4'
                          : 'https://example.com/background.jpg'
                      )}

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          遮罩透明度: {Math.round(config.basic.overlayOpacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={config.basic.overlayOpacity}
                          onChange={(e) =>
                            setConfig((p) => ({
                              ...p,
                              basic: { ...p.basic, overlayOpacity: parseFloat(e.target.value) }
                            }))
                          }
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          数值越大，背景越暗，文字越清晰
                        </p>
                      </div>

                      {/* 预览 */}
                      {config.basic.backgroundUrl && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-foreground mb-2">预览</label>
                          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                            {config.basic.backgroundType === 'video' ? (
                              <video
                                src={config.basic.backgroundUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={config.basic.backgroundUrl}
                                alt="背景预览"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <div
                              className="absolute inset-0 bg-black"
                              style={{ opacity: config.basic.overlayOpacity }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-lg font-medium drop-shadow-lg">
                                {config.basic.title || '站点标题'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEO 配置 */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  SEO 关键词
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    className="flex-1 px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="输入关键词后按回车添加"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.seo.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(index)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {renderInput('OG 图片', config.seo.ogImage, (v) =>
                setConfig((p) => ({ ...p, seo: { ...p.seo, ogImage: v } }))
              )}
              {renderInput('Twitter Card', config.seo.twitterCard, (v) =>
                setConfig((p) => ({ ...p, seo: { ...p.seo, twitterCard: v } })),
                'summary_large_image'
              )}
              {renderInput('Twitter Site', config.seo.twitterSite, (v) =>
                setConfig((p) => ({ ...p, seo: { ...p.seo, twitterSite: v } })),
                '@username'
              )}
            </div>
          )}

          {/* 统计分析 */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              {renderInput('Google Analytics ID', config.analytics.googleAnalyticsId, (v) =>
                setConfig((p) => ({ ...p, analytics: { ...p.analytics, googleAnalyticsId: v } })),
                'G-XXXXXXXXXX'
              )}
              {renderInput('百度统计 ID', config.analytics.baiduTongjiId, (v) =>
                setConfig((p) => ({ ...p, analytics: { ...p.analytics, baiduTongjiId: v } })),
                'xxxxxxxxxx'
              )}
            </div>
          )}

          {/* 页脚设置 */}
          {activeTab === 'footer' && (
            <div className="space-y-4">
              {renderTextarea('版权声明', config.footer.copyright, (v) =>
                setConfig((p) => ({ ...p, footer: { ...p.footer, copyright: v } })),
                '© 2024 我的博客. All rights reserved.'
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('ICP 备案号', config.footer.icpNumber, (v) =>
                  setConfig((p) => ({ ...p, footer: { ...p.footer, icpNumber: v } })),
                  '京ICP备xxxxxxxx号'
                )}
                {renderInput('ICP 查询链接', config.footer.icpUrl, (v) =>
                  setConfig((p) => ({ ...p, footer: { ...p.footer, icpUrl: v } })),
                  'https://beian.miit.gov.cn/'
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('公安备案号', config.footer.policeNumber, (v) =>
                  setConfig((p) => ({ ...p, footer: { ...p.footer, policeNumber: v } })),
                  '京公网安备 xxxxxxxx号'
                )}
                {renderInput('公安查询链接', config.footer.policeUrl, (v) =>
                  setConfig((p) => ({ ...p, footer: { ...p.footer, policeUrl: v } }))
                )}
              </div>
            </div>
          )}

          {/* 作者信息 */}
          {activeTab === 'author' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('名称', config.author.name, (v) =>
                  setConfig((p) => ({ ...p, author: { ...p.author, name: v } }))
                )}
                {renderInput('头像 URL', config.author.avatar, (v) =>
                  setConfig((p) => ({ ...p, author: { ...p.author, avatar: v } }))
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">简介（支持 Markdown）</label>
                <MDEditor
                  value={config.author.bio}
                  onChange={(v) => setConfig((p) => ({ ...p, author: { ...p.author, bio: v || '' } }))}
                  preview="edit"
                  height={200}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('位置', config.author.location, (v) =>
                  setConfig((p) => ({ ...p, author: { ...p.author, location: v } }))
                )}
                {renderInput('邮箱', config.author.email, (v) =>
                  setConfig((p) => ({ ...p, author: { ...p.author, email: v } })),
                  '',
                  'email'
                )}
              </div>
              {config.author.avatar && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">头像预览：</span>
                  <img
                    src={config.author.avatar}
                    alt="头像"
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 社交链接 */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* 支持的图标类型 */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">支持的图标类型</h4>
                <div className="flex flex-wrap gap-2">
                  {['github', 'twitter', 'bilibili', 'weibo', 'zhihu', 'qq', 'wechat', 'email'].map((icon) => (
                    <span key={icon} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {icon}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {config.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{link.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                      <p className="text-xs text-muted-foreground">图标: {link.icon}</p>
                    </div>
                    <button
                      onClick={() => removeSocial(index)}
                      className="px-3 py-1 rounded-lg text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-dashed border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">添加社交链接</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="名称（如 GitHub）"
                    value={newSocial.name}
                    onChange={(e) => setNewSocial((p) => ({ ...p, name: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="url"
                    placeholder="网址"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial((p) => ({ ...p, url: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <select
                    value={newSocial.icon}
                    onChange={(e) => setNewSocial((p) => ({ ...p, icon: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">选择图标</option>
                    <option value="github">GitHub</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="bilibili">哔哩哔哩</option>
                    <option value="weibo">新浪微博</option>
                    <option value="zhihu">知乎</option>
                    <option value="qq">QQ</option>
                    <option value="wechat">微信</option>
                    <option value="email">邮箱</option>
                  </select>
                </div>
                <button
                  onClick={addSocial}
                  disabled={!newSocial.name || !newSocial.url || !newSocial.icon}
                  className="mt-3 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  添加链接
                </button>
              </div>
            </div>
          )}

          {/* 技能标签 */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {config.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      skill.category === 'tech'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : skill.category === 'life'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {skill.name}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1 hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-dashed border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">添加技能标签</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="技能名称"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="tech">技术</option>
                    <option value="life">生活</option>
                    <option value="hobby">兴趣</option>
                  </select>
                  <button
                    onClick={addSkill}
                    disabled={!newSkill.name.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
