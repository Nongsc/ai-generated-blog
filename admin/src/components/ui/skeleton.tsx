import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  repeat?: number;
}

export function Skeleton({ className, repeat = 1 }: SkeletonProps) {
  const elements = [];
  for (let i = 0; i < repeat; i++) {
    elements.push(
      <div
        key={i}
        className={cn(
          'animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
          className
        )}
      />
    );
  }
  return <>{elements}</>;
}

/**
 * 表格行骨架屏
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/**
 * 统计卡片骨架屏
 */
export function StatsCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 表单骨架屏
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/**
 * 侧边栏菜单骨架屏
 */
export function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl" />
      ))}
    </div>
  );
}

/**
 * 媒体网格骨架屏
 */
export function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-xl overflow-hidden">
          <Skeleton className="aspect-square" />
          <div className="p-2 space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
