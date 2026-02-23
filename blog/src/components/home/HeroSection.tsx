"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useBasicConfig } from "@/contexts/SiteConfigContext";

// 一言 API 返回类型
interface HitokotoResponse {
  id: number;
  uuid: string;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: string;
  length: number;
}

export function HeroSection() {
  const basicConfig = useBasicConfig();
  const [hitokoto, setHitokoto] = useState<{ text: string; from: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取一言
    const fetchHitokoto = async () => {
      try {
        const response = await fetch('https://v1.hitokoto.cn');
        const data: HitokotoResponse = await response.json();
        setHitokoto({
          text: data.hitokoto,
          from: data.from || '',
        });
      } catch (error) {
        console.error('Failed to fetch hitokoto:', error);
        setHitokoto({
          text: '生活不止眼前的代码，还有诗和远方。',
          from: '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHitokoto();
  }, []);

  const siteTitle = basicConfig?.title || "我的博客";

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden -mt-16 pt-16">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span>欢迎来到我的博客</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
            {siteTitle}
          </h1>

          {/* Description - 一言 */}
          <div className="max-w-2xl mx-auto">
            {loading ? (
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed drop-shadow animate-pulse">
                正在加载一言...
              </p>
            ) : (
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed drop-shadow">
                {hitokoto?.text}
                {hitokoto?.from && (
                  <span className="text-white/70 text-base ml-2">
                    —— {hitokoto.from}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/posts">
              <ShimmerButton className="flex items-center gap-2 px-6 py-3 rounded-full">
                <span>浏览文章</span>
                <ArrowRight className="w-4 h-4" />
              </ShimmerButton>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <span>关于我</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
