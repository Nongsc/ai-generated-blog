import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Folder, Tag, Eye } from "lucide-react";
import { getPostById, Post } from "@/lib/api-client";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const post = await getPostById(parseInt(id));
    return {
      title: `${post.title} - 博客`,
      description: post.summary || undefined,
    };
  } catch {
    return {
      title: "文章未找到",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  
  let post: Post;
  try {
    post = await getPostById(parseInt(id));
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }

  return (
    <article className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回文章列表</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          {/* Categories */}
          {post.categoryName && post.categorySlug && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/categories/${encodeURIComponent(post.categorySlug)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
              >
                <Folder className="w-3.5 h-3.5" />
                {post.categoryName}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt || post.createdAt}>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {/* View Count */}
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount} 阅读</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.slug)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-muted/80 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.cover && (
          <div className="relative w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[400px] rounded-2xl overflow-hidden mb-8 bg-muted/30 flex items-center justify-center">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose-container">
          <MarkdownRenderer content={post.content || ""} />
        </div>
      </div>
    </article>
  );
}
