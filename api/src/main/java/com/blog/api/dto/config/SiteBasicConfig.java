package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 站点基础配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteBasicConfig {
    private String title;
    private String description;
    private String logo;
    private String favicon;
    private String siteUrl; // 站点 URL

    // 首页背景配置
    private String backgroundType; // "video" 或 "image"
    private String backgroundUrl;  // 视频/图片 URL
    private Double overlayOpacity; // 遮罩透明度 (0-1)
}
