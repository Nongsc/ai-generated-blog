'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, Copy, Check, Video, Music, File } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';

// API 基础 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface Media {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function MediaPage() {
  const { showConfirm } = useConfirm();
  const toast = useToast();
  const [media, setMedia] = useState<Media[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());

      const res = await fetch(`/api/media?${params.toString()}`);
      const data = await res.json();

      setMedia(data.media);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // 获取认证 token
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      const token = sessionData.token;

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        // 直接上传到后端 API
        const res = await fetch(`${API_BASE_URL}/api/admin/media/upload`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        if (res.ok) {
          successCount++;
        } else {
          failCount++;
          const errorData = await res.json().catch(() => ({}));
          console.error('Failed to upload:', file.name, errorData);
        }
      }

      fetchMedia();
      if (successCount > 0) {
        toast.success(`成功上传 ${successCount} 个文件`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} 个文件上传失败`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('上传失败，请检查网络连接');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: '删除文件',
      message: '确定要删除此文件吗？此操作无法撤销。',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('文件已删除');
        fetchMedia();
      } else {
        toast.error('删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('删除失败，请检查网络连接');
    }
  };

  const copyUrl = async (item: Media) => {
    const url = `${API_BASE_URL}${item.path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success('链接已复制');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');
  const isVideo = (mimeType: string) => mimeType.startsWith('video/');
  const isAudio = (mimeType: string) => mimeType.startsWith('audio/');

  const getMediaIcon = (mimeType: string) => {
    if (isImage(mimeType)) return <ImageIcon className="w-12 h-12 text-muted-foreground" />;
    if (isVideo(mimeType)) return <Video className="w-12 h-12 text-blue-500" />;
    if (isAudio(mimeType)) return <Music className="w-12 h-12 text-purple-500" />;
    return <File className="w-12 h-12 text-muted-foreground" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">媒体库</h1>
            <p className="text-muted-foreground">
              管理上传的文件（共 {pagination.total} 个）
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium hover:from-teal-500 hover:to-teal-600 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? '上传中...' : '上传文件'}
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Drop Zone */}
        <div className="glass rounded-2xl p-8 border-2 border-dashed border-border text-center">
          <div className="flex justify-center gap-4 mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <Video className="w-8 h-8 text-blue-500" />
            <Music className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-muted-foreground">
            拖放文件到此处，或点击上方按钮上传
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            支持格式：图片（JPG/PNG/GIF/WebP/SVG）、视频（MP4/WebM/MOV）、音频（MP3/WAV/AAC）
          </p>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : media.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
            暂无媒体文件，上传你的第一个文件吧！
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {media.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="glass rounded-xl overflow-hidden group"
                >
                  {/* Preview */}
                  <div className="aspect-square bg-muted relative">
                    {isImage(item.mimeType) ? (
                      <img
                        src={`${API_BASE_URL}${item.path}`}
                        alt={item.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : isVideo(item.mimeType) ? (
                      <video
                        src={`${API_BASE_URL}${item.path}`}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : isAudio(item.mimeType) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                        <Music className="w-12 h-12 text-purple-500 mb-2" />
                        <audio
                          src={`${API_BASE_URL}${item.path}`}
                          className="w-4/5 max-w-[120px]"
                          controls
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <File className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyUrl(item)}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                        title="复制链接"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors text-white"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-foreground truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(item.size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="text-sm text-muted-foreground">
                  第 {pagination.page} 页，共 {pagination.totalPages} 页
                </span>
                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.min(p.totalPages, p.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
