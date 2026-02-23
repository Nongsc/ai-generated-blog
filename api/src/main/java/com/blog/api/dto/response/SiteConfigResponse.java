package com.blog.api.dto.response;

import com.blog.api.dto.config.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * 站点配置聚合响应
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteConfigResponse {
    private SiteBasicConfig basic;
    private SiteSeoConfig seo;
    private SiteAnalyticsConfig analytics;
    private SiteFooterConfig footer;
    private AuthorConfig author;
    private List<SocialLinkConfig> socialLinks;
    private List<SkillConfig> skills;
}
