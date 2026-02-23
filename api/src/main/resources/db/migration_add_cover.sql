-- 为 post 表添加 cover 字段（如果不存在）
-- 执行此 SQL 来更新现有数据库

ALTER TABLE post ADD COLUMN IF NOT EXISTS cover VARCHAR(500) COMMENT 'Cover image URL' AFTER content;
