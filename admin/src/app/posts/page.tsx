'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useConfirm } from '@/components/ui/confirm-dialog';

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  cover: string | null;
  status: string;
  createdAt: string;
  publishedAt: string | null;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PostsPage() {
  const { showConfirm } = useConfirm();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();

      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: '删除文章',
      message: '确定要删除这篇文章吗？此操作无法撤销。',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
            <p className="text-muted-foreground">管理您的博客文章</p>
          </div>
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium hover:from-pink-500 hover:to-pink-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            新建文章
          </Link>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                搜索
              </button>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">全部状态</option>
              <option value="PUBLISHED">已发布</option>
              <option value="DRAFT">草稿</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              暂无文章，开始创建您的第一篇文章吧！
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      标题
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      状态
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      分类
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      日期
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {post.cover && (
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              <img
                                src={post.cover}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {post.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            post.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {post.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/posts/${post.id}`}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                显示第 {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} 条，共{' '}
                {pagination.total} 条
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded-lg bg-muted text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.min(p.totalPages, p.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 rounded-lg bg-muted text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
