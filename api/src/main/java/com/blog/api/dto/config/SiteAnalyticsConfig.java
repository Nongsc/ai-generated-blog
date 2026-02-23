package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 统计分析配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteAnalyticsConfig {
    private String googleAnalyticsId;
    private String baiduTongjiId; // 兼容旧字段名
}
