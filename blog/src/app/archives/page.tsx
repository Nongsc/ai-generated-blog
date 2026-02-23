import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { getPosts, Post } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "归档",
  description: "按时间归档浏览所有文章",
};

export default async function ArchivesPage() {
  let posts: Post[] = [];
  
  try {
    // 获取所有已发布文章（设置较大的 size）
    const response = await getPosts({ page: 0, size: 1000, status: 1 });
    posts = response.content;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  // 按年月分组
  const archives: Record<string, Record<string, Post[]>> = {};

  posts.forEach((post) => {
    const date = new Date(post.publishedAt || post.createdAt);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    if (!archives[year]) {
      archives[year] = {};
    }
    if (!archives[year][month]) {
      archives[year][month] = [];
    }
    archives[year][month].push(post);
  });

  // 按年月排序
  const sortedYears = Object.keys(archives).sort((a, b) => parseInt(b) - parseInt(a));

  const monthNames: Record<string, string> = {
    "01": "一月",
    "02": "二月",
    "03": "三月",
    "04": "四月",
    "05": "五月",
    "06": "六月",
    "07": "七月",
    "08": "八月",
    "09": "九月",
    "10": "十月",
    "11": "十一月",
    "12": "十二月",
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            文章归档
          </h1>
          <p className="text-muted-foreground">
            共 {posts.length} 篇文章
          </p>
        </header>

        {/* Archive Timeline */}
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {year} 年
              </h2>
              <div className="space-y-6 ml-4 border-l-2 border-border pl-6">
                {Object.keys(archives[year])
                  .sort((a, b) => parseInt(b) - parseInt(a))
                  .map((month) => (
                    <div key={`${year}-${month}`}>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {monthNames[month]}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({archives[year][month].length} 篇)
                        </span>
                      </h3>
                      <ul className="space-y-2">
                        {archives[year][month].map((post) => (
                          <li key={post.id}>
                            <Link
                              href={`/posts/${post.id}`}
                              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <span className="text-sm text-muted-foreground shrink-0">
                                {new Date(post.publishedAt || post.createdAt).getDate()}日
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  {post.title}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                  {post.summary}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
