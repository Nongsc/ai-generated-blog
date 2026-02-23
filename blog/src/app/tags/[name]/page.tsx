import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { getTagBySlug, getPosts, Tag as TagType, Post } from "@/lib/api-client";
import { PostCard } from "@/components/common/PostCard";

interface TagPageProps {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `${decodedName}`,
    description: `浏览标签为 ${decodedName} 的文章`,
  };
}

// 转换 API Post 到 PostCard 需要的格式
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

export default async function TagPage({ params }: TagPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  let tag: TagType | null = null;
  let posts: Post[] = [];

  try {
    tag = await getTagBySlug(decodedName);
    const response = await getPosts({ page: 0, size: 100, status: 1, tagId: tag.id });
    posts = response.content;
  } catch (error) {
    console.error('Failed to fetch tag:', error);
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/tags"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回标签列表</span>
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Tag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {tag.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {posts.length} 篇文章
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={mapPostToCard(post)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">该标签下暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
