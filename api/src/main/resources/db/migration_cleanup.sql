-- 删除旧的/冗余的配置数据
-- 执行前请确认备份数据

-- 删除 site 配置（旧的整体配置）
DELETE FROM site_config WHERE config_key = 'site';

-- 删除 site_analytics 配置（已使用 analytics）
DELETE FROM site_config WHERE config_key = 'site_analytics';

-- 确认删除结果
-- SELECT * FROM site_config;
