package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 技能配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillConfig {
    private String name;
    private String category; // tech, life, hobby
}
