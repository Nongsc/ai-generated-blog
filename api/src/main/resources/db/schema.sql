-- Blog API Database Schema
-- Created: 2026-02-23

CREATE DATABASE IF NOT EXISTS blog_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog_db;

-- User Table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Username',
    password VARCHAR(255) NOT NULL COMMENT 'Password (BCrypt encoded)',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Email',
    nickname VARCHAR(50) COMMENT 'Nickname',
    avatar VARCHAR(255) COMMENT 'Avatar URL',
    bio TEXT COMMENT 'Biography',
    status TINYINT DEFAULT 1 COMMENT 'Status: 0-disabled, 1-enabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User Table';

-- Category Table
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'Category name',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL slug',
    description VARCHAR(255) COMMENT 'Description',
    parent_id BIGINT DEFAULT NULL COMMENT 'Parent category ID',
    sort_order INT DEFAULT 0 COMMENT 'Sort order',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Category Table';

-- Tag Table
CREATE TABLE IF NOT EXISTS tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'Tag name',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL slug',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tag Table';

-- Post Table
CREATE TABLE IF NOT EXISTS post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT 'Post title',
    slug VARCHAR(200) NOT NULL UNIQUE COMMENT 'URL slug',
    summary VARCHAR(500) COMMENT 'Summary',
    content LONGTEXT COMMENT 'Content',
    cover VARCHAR(500) COMMENT 'Cover image URL',
    author_id BIGINT NOT NULL COMMENT 'Author ID',
    category_id BIGINT COMMENT 'Category ID',
    status TINYINT DEFAULT 0 COMMENT 'Status: 0-draft, 1-published, 2-archived',
    view_count INT DEFAULT 0 COMMENT 'View count',
    published_at DATETIME COMMENT 'Published at',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_slug (slug),
    INDEX idx_author_id (author_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Post Table';

-- Post-Tag Relation Table
CREATE TABLE IF NOT EXISTS post_tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL COMMENT 'Post ID',
    tag_id BIGINT NOT NULL COMMENT 'Tag ID',
    INDEX idx_post_id (post_id),
    INDEX idx_tag_id (tag_id),
    UNIQUE KEY uk_post_tag (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Post-Tag Relation Table';

-- Media Table
CREATE TABLE IF NOT EXISTS media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL COMMENT 'Stored filename',
    original_filename VARCHAR(255) NOT NULL COMMENT 'Original filename',
    filepath VARCHAR(500) NOT NULL COMMENT 'File path',
    mime_type VARCHAR(100) NOT NULL COMMENT 'MIME type',
    size BIGINT NOT NULL COMMENT 'File size in bytes',
    uploader_id BIGINT NOT NULL COMMENT 'Uploader ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    INDEX idx_uploader_id (uploader_id),
    FOREIGN KEY (uploader_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Media Table';

-- FriendLink Table
CREATE TABLE IF NOT EXISTS friend_link (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'Site name',
    url VARCHAR(255) NOT NULL UNIQUE COMMENT 'Site URL',
    avatar VARCHAR(255) COMMENT 'Avatar URL',
    description VARCHAR(255) COMMENT 'Description',
    sort_order INT DEFAULT 0 COMMENT 'Sort order',
    status TINYINT DEFAULT 1 COMMENT 'Status: 0-disabled, 1-enabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Friend Link Table';

-- SiteConfig Table
CREATE TABLE IF NOT EXISTS site_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Config key',
    config_value TEXT COMMENT 'Config value (JSON)',
    description VARCHAR(255) COMMENT 'Description',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Site Config Table';

-- Insert default admin user (password: admin123)
INSERT INTO user (username, password, email, nickname, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'admin@blog.com', 'Administrator', 1);
