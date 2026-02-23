'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  count: number;
}

export default function CategoriesPage() {
  const { showConfirm } = useConfirm();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? '分类更新成功' : '分类创建成功');
        fetchCategories();
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

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: '删除分类',
      message: '确定要删除这个分类吗？',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('分类已删除');
        fetchCategories();
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
    setFormData({ name: '', slug: '', description: '' });
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">分类管理</h1>
            <p className="text-muted-foreground">管理文章分类</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            新建分类
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
              {editingId ? '编辑分类' : '新建分类'}
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                />
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

        {/* Categories Grid */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : categories.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
            暂无分类，开始创建您的第一个分类吧！
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <FolderTree className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{category.slug}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {category.count} 篇文章
                  </span>
                </div>

                {category.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
