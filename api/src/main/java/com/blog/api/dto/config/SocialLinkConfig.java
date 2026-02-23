package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 社交链接配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLinkConfig {
    private String name;
    private String url;
    private String icon;
}
