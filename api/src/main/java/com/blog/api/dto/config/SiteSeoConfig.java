package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * SEO 配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteSeoConfig {
    private List<String> keywords;
    private String ogImage;
    private String twitterCard;
    private String twitterSite;
}
