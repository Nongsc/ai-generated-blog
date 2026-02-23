package com.blog.api.controller.admin;

import com.blog.api.dto.request.ConfigRequest;
import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.ConfigResponse;
import com.blog.api.dto.response.SiteConfigResponse;
import com.blog.api.service.ConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin 后台 - 站点配置管理接口（需认证）
 */
@Tag(name = "Admin - 站点配置管理", description = "Admin 站点配置管理接口")
@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
public class AdminConfigController {

    private final ConfigService configService;

    @Operation(summary = "获取所有站点配置（聚合）")
    @GetMapping("/site")
    public ApiResponse<SiteConfigResponse> getSiteConfig() {
        SiteConfigResponse response = configService.getAllConfigs();
        return ApiResponse.success(response);
    }

    @Operation(summary = "保存所有站点配置（聚合）")
    @PostMapping("/site")
    public ApiResponse<Void> saveSiteConfig(@RequestBody SiteConfigResponse request) {
        configService.saveAllConfigs(request);
        return ApiResponse.success("配置保存成功", null);
    }

    @Operation(summary = "获取配置")
    @GetMapping
    public ApiResponse<?> getConfig(
            @Parameter(description = "配置键（可选，不传则返回所有配置）")
            @RequestParam(required = false) String key) {
        if (key != null && !key.isEmpty()) {
            ConfigResponse response = configService.getByKey(key);
            if (response == null) {
                return ApiResponse.success(null);
            }
            return ApiResponse.success(response);
        }
        List<ConfigResponse> configs = configService.getAll();
        return ApiResponse.success(configs);
    }

    @Operation(summary = "保存配置")
    @PostMapping
    public ApiResponse<ConfigResponse> saveConfig(@Valid @RequestBody ConfigRequest request) {
        ConfigResponse response = configService.save(request);
        return ApiResponse.success("配置保存成功", response);
    }
}
