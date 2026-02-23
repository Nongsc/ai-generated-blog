package com.blog.api.controller.blog;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.SiteConfigResponse;
import com.blog.api.service.ConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Blog 前台 - 站点配置接口（公开）
 */
@Tag(name = "Blog - 站点配置", description = "Blog 前台站点配置接口")
@RestController
@RequestMapping("/api/blog/config")
@RequiredArgsConstructor
public class BlogConfigController {

    private final ConfigService configService;

    @Operation(summary = "获取站点配置")
    @GetMapping("/site")
    public ApiResponse<SiteConfigResponse> getSiteConfig() {
        SiteConfigResponse response = configService.getAllConfigs();
        return ApiResponse.success(response);
    }
}
