import { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import { getTags, Tag as TagType } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览文章",
};

// 颜色调色板
const colors = [
  "from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30",
  "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30",
  "from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30",
  "from-purple-500/20 to-violet-500/20 hover:from-purple-500/30 hover:to-violet-500/30",
  "from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30",
  "from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30",
  "from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30",
  "from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30",
];

export default async function TagsPage() {
  let tags: TagType[] = [];
  
  try {
    tags = await getTags();
  } catch (error) {
    console.error('Failed to fetch tags:', error);
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            标签云
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            按标签浏览文章
          </p>
        </div>

        {/* Tags Cloud */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {tags.length > 0 ? (
            tags.map((tag, index) => {
              const colorClass = colors[index % colors.length];

              return (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.slug)}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-gradient-to-r ${colorClass} border border-border/50 hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <Tag className="w-4 h-4 opacity-70" />
                  <span className="font-medium text-foreground">{tag.name}</span>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无标签</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {tags.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            共 {tags.length} 个标签
          </div>
        )}
      </div>
    </div>
  );
}
