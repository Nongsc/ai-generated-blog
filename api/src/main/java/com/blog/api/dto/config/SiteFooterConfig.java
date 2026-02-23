package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 页脚配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteFooterConfig {
    private String copyright;
    private String icpNumber;
    private String icpUrl;
    private String policeNumber;
    private String policeUrl;
}
