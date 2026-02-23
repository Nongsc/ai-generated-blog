import { Metadata } from "next";
import Link from "next/link";
import { Folder } from "lucide-react";
import { getCategories, Category } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "分类",
  description: "按分类浏览文章",
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

export default async function CategoriesPage() {
  let categories: Category[] = [];
  
  try {
    categories = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            分类
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            按主题浏览文章
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const colorClass = colors[index % colors.length];

              return (
                <Link
                  key={category.id}
                  href={`/categories/${encodeURIComponent(category.slug)}`}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-r ${colorClass} border border-border/50 hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <Folder className="w-8 h-8 mb-3 text-primary opacity-80" />
                  <span className="font-medium text-foreground text-center">{category.name}</span>
                  {category.description && (
                    <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-1">
                      {category.description}
                    </span>
                  )}
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">暂无分类</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {categories.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            共 {categories.length} 个分类
          </div>
        )}
      </div>
    </div>
  );
}
