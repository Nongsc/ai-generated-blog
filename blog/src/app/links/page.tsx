import { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getFriendLinks, FriendLink, getSiteConfig } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "友情链接",
  description: "我的友情链接",
};

export default async function LinksPage() {
  let friendLinks: FriendLink[] = [];
  let siteConfig = null;
  
  try {
    const [links, config] = await Promise.all([
      getFriendLinks(),
      getSiteConfig(),
    ]);
    friendLinks = links;
    siteConfig = config;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  // 本站信息
  const siteInfo = {
    name: siteConfig?.basic?.title || "我的博客",
    url: siteConfig?.basic?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    description: siteConfig?.basic?.description || "一个个人博客",
    avatar: siteConfig?.basic?.logo || siteConfig?.author?.avatar,
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            友情链接
          </h1>
          <p className="text-muted-foreground">
            与我交换链接的朋友们
          </p>
        </header>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friendLinks.length > 0 ? (
            friendLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl backdrop-blur-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: 'hsl(var(--card) / 0.8)' }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                    {link.avatar ? (
                      <img
                        src={link.avatar}
                        alt={link.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold text-xl">
                        {link.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {link.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {link.description || "暂无描述"}
                    </p>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">暂无友情链接</p>
            </div>
          )}
        </div>

        {/* Apply for Link */}
        <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            申请友链
          </h2>
          <p className="text-muted-foreground mb-4">
            欢迎与我交换友链！请确保您的网站符合以下要求：
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>网站内容健康、合法</li>
            <li>网站能够正常访问</li>
            <li>优先考虑技术类、设计类博客</li>
          </ul>
          <div className="p-4 rounded-lg backdrop-blur-sm border border-border"
               style={{ backgroundColor: 'hsl(var(--card) / 0.85)' }}>
            <h3 className="font-semibold text-foreground mb-2">本站信息</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">名称：</span>{siteInfo.name}</p>
              <p><span className="font-medium text-foreground">链接：</span>{siteInfo.url}</p>
              <p><span className="font-medium text-foreground">描述：</span>{siteInfo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
