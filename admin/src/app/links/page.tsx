'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Link2, ExternalLink, GripVertical } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

interface FriendLink {
  id: number;
  name: string;
  url: string;
  avatar: string;
  description: string | null;
  sortOrder: number;
}

export default function LinksPage() {
  const { showConfirm } = useConfirm();
  const toast = useToast();
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    avatar: '',
    description: '',
    sortOrder: 0,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/links/${editingId}` : '/api/links';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sortOrder: parseInt(formData.sortOrder.toString(), 10) || 0,
        }),
      });

      if (res.ok) {
        toast.success(editingId ? '友链更新成功' : '友链创建成功');
        fetchLinks();
        resetForm();
      } else {
        const data = await res.json();
        toast.error(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('保存失败，请检查网络连接');
    }
  };

  const handleEdit = (link: FriendLink) => {
    setEditingId(link.id);
    setFormData({
      name: link.name,
      url: link.url,
      avatar: link.avatar,
      description: link.description || '',
      sortOrder: link.sortOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: '删除友链',
      message: '确定要删除这个友链吗？',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('友链已删除');
        fetchLinks();
      } else {
        const data = await res.json();
        toast.error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('删除失败，请检查网络连接');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      url: '',
      avatar: '',
      description: '',
      sortOrder: 0,
    });
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">友情链接</h1>
            <p className="text-muted-foreground">管理您的博客友链</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 text-white font-medium hover:from-purple-500 hover:to-purple-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            新建友链
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingId ? '编辑友链' : '新建友链'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    网址
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, url: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    头像网址
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, avatar: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    排序
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                />
              </div>
              {formData.avatar && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">预览：</span>
                  <img
                    src={formData.avatar}
                    alt="头像预览"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/48x48?text=X';
                    }}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {editingId ? '更新' : '创建'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Links List */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : links.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
            暂无友链，添加您的第一个友链吧！
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Sort Handle */}
                  <div className="text-muted-foreground cursor-grab">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Avatar */}
                  <img
                    src={link.avatar || 'https://placehold.co/48x48?text=Link'}
                    alt={link.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/48x48?text=Link';
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {link.name}
                      </h3>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {link.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {link.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {link.url}
                    </p>
                  </div>

                  {/* Order Badge */}
                  <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    排序: {link.sortOrder}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(link)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
