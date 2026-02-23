'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

// Dynamically import Markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover: string | null;
  status: string;
  categories: Category[];
  tags: Tag[];
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { showConfirm } = useConfirm();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [cover, setCover] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 先并行加载分类和标签
        const [categoriesRes, tagsRes, postRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags'),
          fetch(`/api/posts/${postId}`),
        ]);

        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();
        const postData = await postRes.json();

        // 设置分类和标签列表
        setCategories(categoriesData);
        setTags(tagsData);

        // 设置文章数据
        setTitle(postData.title);
        setSlug(postData.slug);
        setContent(postData.content);
        setExcerpt(postData.excerpt || '');
        setCover(postData.cover || '');
        setStatus(postData.status);
        setSelectedCategory(postData.categories?.[0]?.id || null);
        setSelectedTags(postData.tags?.map((t: Tag) => t.id) || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/posts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          cover,
          status,
          categoryIds: selectedCategory ? [selectedCategory] : [],
          tagIds: selectedTags,
        }),
      });

      if (res.ok) {
        toast.success('文章更新成功');
        router.push('/posts');
      } else {
        const data = await res.json();
        toast.error(data.error || '更新失败，请稍后重试');
      }
    } catch (error) {
      console.error('Update post error:', error);
      toast.error('更新失败，请检查网络连接');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: '删除文章',
      message: '确定要删除这篇文章吗？此操作无法撤销。',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('文章已删除');
        router.push('/posts');
      } else {
        const data = await res.json();
        toast.error(data.error || '删除失败，请稍后重试');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('删除失败，请检查网络连接');
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/posts"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">编辑文章</h1>
              <p className="text-muted-foreground">更新您的博客文章</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            删除
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="文章标题"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    别名
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="文章 URL 别名"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    内容
                  </label>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      height={400}
                      preview="edit"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    摘要
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                    placeholder="文章简介"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Status */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  状态
                </h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                </select>
              </div>

              {/* Cover */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  封面图片
                </h3>
                <input
                  type="text"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://example.com/image.jpg"
                />
                {cover && (
                  <div className="mt-4 rounded-xl overflow-hidden bg-muted">
                    <img src={cover} alt="封面预览" className="w-full h-auto" />
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  分类
                </h3>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  标签
                </h3>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || !title || !slug || !content}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium hover:from-pink-500 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? '保存中...' : '更新文章'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
