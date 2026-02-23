package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.api.dto.config.*;
import com.blog.api.dto.request.ConfigRequest;
import com.blog.api.dto.response.ConfigResponse;
import com.blog.api.dto.response.SiteConfigResponse;
import com.blog.api.entity.SiteConfig;
import com.blog.api.mapper.SiteConfigMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConfigService {

    private final SiteConfigMapper siteConfigMapper;
    private final ObjectMapper objectMapper;

    // 配置 key 常量
    public static final String KEY_SITE_BASIC = "site_basic";
    public static final String KEY_SITE_SEO = "site_seo";
    public static final String KEY_SITE_ANALYTICS = "analytics"; // 兼容旧数据
    public static final String KEY_SITE_FOOTER = "site_footer";
    public static final String KEY_AUTHOR = "author";
    public static final String KEY_SOCIAL_LINKS = "social_links";
    public static final String KEY_SKILLS = "skills";

    // ==================== 聚合配置 ====================

    /**
     * 获取所有站点配置（聚合）
     */
    public SiteConfigResponse getAllConfigs() {
        return SiteConfigResponse.builder()
                .basic(getConfig(KEY_SITE_BASIC, SiteBasicConfig.class))
                .seo(getConfig(KEY_SITE_SEO, SiteSeoConfig.class))
                .analytics(getConfig(KEY_SITE_ANALYTICS, SiteAnalyticsConfig.class))
                .footer(getConfig(KEY_SITE_FOOTER, SiteFooterConfig.class))
                .author(getConfig(KEY_AUTHOR, AuthorConfig.class))
                .socialLinks(getConfigList(KEY_SOCIAL_LINKS, new TypeReference<List<SocialLinkConfig>>() {}))
                .skills(getConfigList(KEY_SKILLS, new TypeReference<List<SkillConfig>>() {}))
                .build();
    }

    /**
     * 保存所有站点配置（聚合）
     */
    @Transactional
    public void saveAllConfigs(SiteConfigResponse configs) {
        if (configs.getBasic() != null) {
            saveConfig(KEY_SITE_BASIC, configs.getBasic());
        }
        if (configs.getSeo() != null) {
            saveConfig(KEY_SITE_SEO, configs.getSeo());
        }
        if (configs.getAnalytics() != null) {
            saveConfig(KEY_SITE_ANALYTICS, configs.getAnalytics());
        }
        if (configs.getFooter() != null) {
            saveConfig(KEY_SITE_FOOTER, configs.getFooter());
        }
        if (configs.getAuthor() != null) {
            saveConfig(KEY_AUTHOR, configs.getAuthor());
        }
        if (configs.getSocialLinks() != null) {
            saveConfig(KEY_SOCIAL_LINKS, configs.getSocialLinks());
        }
        if (configs.getSkills() != null) {
            saveConfig(KEY_SKILLS, configs.getSkills());
        }
    }

    // ==================== 单个配置操作 ====================

    public ConfigResponse getByKey(String key) {
        LambdaQueryWrapper<SiteConfig> query = new LambdaQueryWrapper<>();
        query.eq(SiteConfig::getConfigKey, key);
        SiteConfig config = siteConfigMapper.selectOne(query);
        
        if (config == null) {
            return null;
        }
        
        return ConfigResponse.builder()
                .key(config.getConfigKey())
                .value(config.getConfigValue())
                .description(config.getDescription())
                .build();
    }

    public List<ConfigResponse> getAll() {
        List<SiteConfig> configs = siteConfigMapper.selectList(null);
        return configs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ConfigResponse save(ConfigRequest request) {
        LambdaQueryWrapper<SiteConfig> query = new LambdaQueryWrapper<>();
        query.eq(SiteConfig::getConfigKey, request.getKey());
        SiteConfig config = siteConfigMapper.selectOne(query);

        if (config == null) {
            config = new SiteConfig();
            config.setConfigKey(request.getKey());
            config.setConfigValue(request.getValue());
            config.setCreatedAt(LocalDateTime.now());
            config.setUpdatedAt(LocalDateTime.now());
            siteConfigMapper.insert(config);
        } else {
            config.setConfigValue(request.getValue());
            config.setUpdatedAt(LocalDateTime.now());
            siteConfigMapper.updateById(config);
        }

        return toResponse(config);
    }

    // ==================== 泛型配置方法 ====================

    private <T> T getConfig(String key, Class<T> clazz) {
        try {
            SiteConfig config = getConfigEntity(key);
            if (config == null || config.getConfigValue() == null) {
                return clazz.getDeclaredConstructor().newInstance();
            }
            return objectMapper.readValue(config.getConfigValue(), clazz);
        } catch (Exception e) {
            log.warn("Failed to parse config for key: {}, error: {}", key, e.getMessage());
            try {
                return clazz.getDeclaredConstructor().newInstance();
            } catch (Exception ex) {
                return null;
            }
        }
    }

    private <T> List<T> getConfigList(String key, TypeReference<List<T>> typeRef) {
        try {
            SiteConfig config = getConfigEntity(key);
            if (config == null || config.getConfigValue() == null) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(config.getConfigValue(), typeRef);
        } catch (Exception e) {
            log.warn("Failed to parse config list for key: {}, error: {}", key, e.getMessage());
            return new ArrayList<>();
        }
    }

    private <T> void saveConfig(String key, T value) {
        try {
            String jsonValue = objectMapper.writeValueAsString(value);
            
            LambdaQueryWrapper<SiteConfig> query = new LambdaQueryWrapper<>();
            query.eq(SiteConfig::getConfigKey, key);
            SiteConfig config = siteConfigMapper.selectOne(query);

            if (config == null) {
                config = new SiteConfig();
                config.setConfigKey(key);
                config.setConfigValue(jsonValue);
                config.setCreatedAt(LocalDateTime.now());
                config.setUpdatedAt(LocalDateTime.now());
                siteConfigMapper.insert(config);
            } else {
                config.setConfigValue(jsonValue);
                config.setUpdatedAt(LocalDateTime.now());
                siteConfigMapper.updateById(config);
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize config for key: {}", key, e);
            throw new RuntimeException("Failed to save config: " + key);
        }
    }

    private SiteConfig getConfigEntity(String key) {
        LambdaQueryWrapper<SiteConfig> query = new LambdaQueryWrapper<>();
        query.eq(SiteConfig::getConfigKey, key);
        return siteConfigMapper.selectOne(query);
    }

    private ConfigResponse toResponse(SiteConfig config) {
        return ConfigResponse.builder()
                .key(config.getConfigKey())
                .value(config.getConfigValue())
                .description(config.getDescription())
                .build();
    }
}
