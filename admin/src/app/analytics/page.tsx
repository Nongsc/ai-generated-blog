'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, BarChart2, Code, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/toast';

interface AnalyticsConfig {
  googleAnalyticsId: string;
  baiduTongjiId: string;
  customScripts: string;
}

const defaultConfig: AnalyticsConfig = {
  googleAnalyticsId: '',
  baiduTongjiId: '',
  customScripts: '',
};

export default function AnalyticsPage() {
  const { success, error } = useToast();
  const [config, setConfig] = useState<AnalyticsConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config?key=analytics');
      const data = await res.json();
      if (data.value) {
        setConfig({ ...defaultConfig, ...data.value });
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'analytics', value: config }),
      });

      if (res.ok) {
        success('统计配置保存成功！');
      } else {
        error('保存失败');
      }
    } catch (err) {
      console.error('Save error:', err);
      error('保存失败');
    } finally {
      setSaving(false);
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">统计配置</h1>
            <p className="text-muted-foreground">配置第三方统计工具</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 text-white font-medium hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存配置'}
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Google Analytics</h3>
                <p className="text-xs text-muted-foreground">使用 GA4 追踪访客</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                衡量 ID (G-XXXXXXXXXX)
              </label>
              <input
                type="text"
                value={config.googleAnalyticsId}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    googleAnalyticsId: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground mt-2">
                在 Google Analytics 管理中心 - 数据流中查找衡量 ID
              </p>
            </div>

            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
            >
              打开 Google Analytics
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>

          {/* Baidu Tongji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">百度统计</h3>
                <p className="text-xs text-muted-foreground">
                  用于国内流量分析
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                站点 ID
              </label>
              <input
                type="text"
                value={config.baiduTongjiId}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    baiduTongjiId: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="1234567890"
              />
              <p className="text-xs text-muted-foreground mt-2">
                从百度统计代码片段中获取站点 ID
              </p>
            </div>

            <a
              href="https://tongji.baidu.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
            >
              打开百度统计
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>

        {/* Custom Scripts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">自定义脚本</h3>
              <p className="text-xs text-muted-foreground">
                添加自定义统计或追踪脚本
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              脚本 HTML（将插入到 head 中）
            </label>
            <textarea
              value={config.customScripts}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  customScripts: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm min-h-[200px]"
              placeholder={`<!-- 示例 -->
<script>
  // 你的自定义统计代码
</script>`}
            />
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">生成的代码预览</h3>
          <pre className="p-4 rounded-xl bg-muted overflow-x-auto text-xs text-muted-foreground">
            {config.googleAnalyticsId && (
              <>
                {`<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${config.googleAnalyticsId}');
</script>`}
                {'\n\n'}
              </>
            )}
            {config.baiduTongjiId && (
              <>
                {`<!-- 百度统计 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${config.baiduTongjiId}";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>`}
                {'\n\n'}
              </>
            )}
            {config.customScripts && (
              <>
                {`<!-- 自定义脚本 -->\n${config.customScripts}`}
              </>
            )}
            {!config.googleAnalyticsId &&
              !config.baiduTongjiId &&
              !config.customScripts &&
              '<!-- 未配置统计工具 -->'}
          </pre>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
