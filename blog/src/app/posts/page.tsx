import { Metadata } from "next";
import { getPosts, Post } from "@/lib/api-client";
import { PostCard } from "@/components/common/PostCard";

export const metadata: Metadata = {
  title: "文章",
  description: "浏览所有文章",
};

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

export default async function PostsPage() {
  let posts: Post[] = [];
  let totalElements = 0;

  try {
    const response = await getPosts({ page: 0, size: 100, status: 1 });
    posts = response.content;
    totalElements = response.totalElements;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            全部文章
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            探索所有文章、故事和见解
          </p>
          {totalElements > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              共 {totalElements} 篇文章
            </p>
          )}
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
            <p className="text-muted-foreground">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
