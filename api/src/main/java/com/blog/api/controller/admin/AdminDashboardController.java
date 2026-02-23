package com.blog.api.controller.admin;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.DashboardStatsResponse;
import com.blog.api.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin 后台 - 仪表盘接口（需认证）
 */
@Tag(name = "Admin - 仪表盘", description = "Admin 仪表盘统计接口")
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "获取仪表盘统计数据")
    @GetMapping("/stats")
    public ApiResponse<DashboardStatsResponse> getStats() {
        DashboardStatsResponse stats = dashboardService.getStats();
        return ApiResponse.success(stats);
    }
}
