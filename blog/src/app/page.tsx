import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPosts, Post } from "@/lib/api-client";
import { PostCardHorizontal } from "@/components/common/PostCardHorizontal";
import { HeroSection } from "@/components/home/HeroSection";

// 转换 API Post 到 PostCardHorizontal 需要的格式
function mapPostToCard(post: Post) {
  return {
    id: post.id,
    title: post.title,
    date: post.publishedAt || post.createdAt,
    categories: post.categoryName ? [post.categoryName] : [],
    tags: post.tags?.map(t => t.name) || [],
    cover: post.cover,
    excerpt: post.summary || "",
    slug: post.slug,
    viewCount: post.viewCount,
  };
}

export default async function Home() {
  let posts: Post[] = [];
  
  try {
    const response = await getPosts({ page: 0, size: 6, status: 1 });
    posts = response.content;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full screen, no background */}
      <HeroSection />

      {/* Latest Posts Section - With semi-transparent background */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
        <div className="w-[64%] mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                最新文章
              </h2>
              <p className="mt-2 text-muted-foreground">
                发现最新的故事和见解
              </p>
            </div>
            <Link
              href="/posts"
              className="hidden sm:flex items-center gap-2 text-primary hover:underline"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Posts Grid - Single Column */}
          <div className="flex flex-col gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCardHorizontal key={post.id} post={mapPostToCard(post)} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                暂无文章
              </div>
            )}
          </div>

          {/* Mobile View All */}
          <div className="mt-8 sm:hidden">
            <Link
              href="/posts"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
            >
              <span>查看全部文章</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
