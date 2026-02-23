package com.blog.api.dto.config;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 作者配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorConfig {
    private String name;
    private String avatar;
    private String bio;
    private String location;
    private String email;
}
