'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FolderTree,
  Tags,
  Link2,
  TrendingUp,
  Eye,
  Calendar,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardStats {
  postCount: number;
  categoryCount: number;
  tagCount: number;
  friendLinkCount: number;
  totalViewCount: number;
  recentPosts: RecentPost[];
}

interface RecentPost {
  id: number;
  title: string;
  status: number;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      title: '文章总数',
      value: stats.postCount,
      change: '已发布文章',
      icon: FileText,
      color: 'from-pink-400 to-pink-600',
    },
    {
      title: '分类数量',
      value: stats.categoryCount,
      change: '活跃分类',
      icon: FolderTree,
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: '标签数量',
      value: stats.tagCount,
      change: '已使用标签',
      icon: Tags,
      color: 'from-green-400 to-green-600',
    },
    {
      title: '友情链接',
      value: stats.friendLinkCount,
      change: '活跃链接',
      icon: Link2,
      color: 'from-purple-400 to-purple-600',
    },
  ] : [];

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return '已发布';
      case 2:
        return '已归档';
      default:
        return '草稿';
    }
  };

  const getStatusClass = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 2:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">仪表盘</h1>
          <p className="text-muted-foreground">
            欢迎回来，这是您的博客概览。
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">最近文章</h2>
                <a
                  href="/posts"
                  className="text-sm text-primary hover:underline"
                >
                  查看全部
                </a>
              </div>

              {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          标题
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          状态
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          日期
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          阅读
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPosts.map((post, index) => (
                        <motion.tr
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <a
                              href={`/posts/${post.id}`}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {post.title}
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusClass(post.status)}`}
                            >
                              {getStatusText(post.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {post.publishedAt || post.createdAt}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-muted-foreground">
                              <Eye className="w-4 h-4" />
                              {post.viewCount.toLocaleString()}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  暂无文章，开始写你的第一篇吧！
                </div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  流量概览
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-2xl font-bold text-foreground">
                        {stats?.totalViewCount.toLocaleString() || 0}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      总访问量
                    </p>
                  </div>
                  <div className="w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted opacity-20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${75 * 2.51} ${25 * 2.51}`}
                        strokeLinecap="round"
                        className="text-primary"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  快捷操作
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/posts/new"
                    className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-center"
                  >
                    <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm text-foreground">写文章</span>
                  </a>
                  <a
                    href="/media"
                    className="p-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors text-center"
                  >
                    <Eye className="w-6 h-6 mx-auto mb-2 text-secondary" />
                    <span className="text-sm text-foreground">媒体库</span>
                  </a>
                  <a
                    href="/config"
                    className="p-3 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors text-center"
                  >
                    <Tags className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <span className="text-sm text-foreground">设置</span>
                  </a>
                  <a
                    href="/analytics"
                    className="p-3 rounded-xl bg-purple-100/10 hover:bg-purple-100/20 transition-colors text-center dark:bg-purple-900/10 dark:hover:bg-purple-900/20"
                  >
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <span className="text-sm text-foreground">统计</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
