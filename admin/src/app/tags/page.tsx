'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

interface TagItem {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export default function TagsPage() {
  const { showConfirm } = useConfirm();
  const toast = useToast();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/tags/${editingId}` : '/api/tags';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? '标签更新成功' : '标签创建成功');
        fetchTags();
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

  const handleEdit = (tag: TagItem) => {
    setEditingId(tag.id);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: '删除标签',
      message: '确定要删除这个标签吗？',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('标签已删除');
        fetchTags();
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
    setFormData({ name: '', slug: '' });
    setShowForm(false);
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    }));
  };

  // Color palette for tags
  const tagColors = [
    'from-pink-400 to-pink-500',
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-purple-400 to-purple-500',
    'from-orange-400 to-orange-500',
    'from-teal-400 to-teal-500',
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">标签管理</h1>
            <p className="text-muted-foreground">管理文章标签</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white font-medium hover:from-green-500 hover:to-green-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            新建标签
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
              {editingId ? '编辑标签' : '新建标签'}
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
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    别名
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
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

        {/* Tags Grid */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : tags.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
            暂无标签，开始创建您的第一个标签吧！
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {tags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="glass rounded-xl p-4 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                      tagColors[index % tagColors.length]
                    } flex items-center justify-center`}
                  >
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {tag.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {tag.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {tag.count} 篇文章
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
