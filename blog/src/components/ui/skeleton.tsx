import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  repeat?: number;
}

/**
 * 基础骨架屏组件
 */
export function Skeleton({ className, repeat = 1 }: SkeletonProps) {
  const elements = [];
  for (let i = 0; i < repeat; i++) {
    elements.push(
      <div
        key={i}
        className={cn(
          'animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
          'animate-[shimmer_2s_infinite]',
          className
        )}
      />
    );
  }
  return <>{elements}</>;
}

/**
 * 文章卡片骨架屏
 */
export function PostCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* 封面 */}
      <Skeleton className="w-full h-48" />
      <div className="p-5 space-y-3">
        {/* 标题 */}
        <Skeleton className="h-6 w-3/4" />
        {/* 摘要 */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        {/* 元信息 */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * 文章列表骨架屏
 */
export function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 文章详情骨架屏
 */
export function PostDetailSkeleton() {
  return (
    <article className="max-w-4xl mx-auto space-y-6">
      {/* 封面 */}
      <Skeleton className="w-full h-64 md:h-96 rounded-2xl" />
      {/* 标题 */}
      <Skeleton className="h-10 w-3/4" />
      {/* 元信息 */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      {/* 内容 */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </article>
  );
}

/**
 * 分类/标签骨架屏
 */
export function CategorySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  );
}

/**
 * 侧边栏骨架屏
 */
export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* 作者简介 */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <Skeleton className="w-20 h-20 rounded-full mx-auto" />
        <Skeleton className="h-5 w-24 mx-auto" />
        <Skeleton className="h-4 w-full" />
      </div>
      {/* 分类列表 */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <Skeleton className="h-5 w-20" />
        <CategorySkeleton count={5} />
      </div>
    </div>
  );
}

/**
 * 友链卡片骨架屏
 */
export function FriendLinkSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
