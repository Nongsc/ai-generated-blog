package com.blog.api.controller.admin;

import com.blog.api.dto.request.FriendLinkRequest;
import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.FriendLinkResponse;
import com.blog.api.service.FriendLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin 后台 - 友情链接管理接口（需认证）
 */
@Tag(name = "Admin - 友情链接管理", description = "Admin 友情链接管理接口")
@RestController
@RequestMapping("/api/admin/links")
@RequiredArgsConstructor
public class AdminFriendLinkController {

    private final FriendLinkService friendLinkService;

    @Operation(summary = "创建友情链接")
    @PostMapping
    public ApiResponse<FriendLinkResponse> create(@Valid @RequestBody FriendLinkRequest request) {
        FriendLinkResponse response = friendLinkService.create(request);
        return ApiResponse.success("友情链接创建成功", response);
    }

    @Operation(summary = "根据ID获取友情链接")
    @GetMapping("/{id}")
    public ApiResponse<FriendLinkResponse> getById(
            @Parameter(description = "友情链接ID") @PathVariable Long id) {
        FriendLinkResponse response = friendLinkService.getById(id);
        return ApiResponse.success(response);
    }

    @Operation(summary = "获取所有友情链接")
    @GetMapping
    public ApiResponse<List<FriendLinkResponse>> getAll() {
        List<FriendLinkResponse> links = friendLinkService.getAll();
        return ApiResponse.success(links);
    }

    @Operation(summary = "更新友情链接")
    @PutMapping("/{id}")
    public ApiResponse<FriendLinkResponse> update(
            @Parameter(description = "友情链接ID") @PathVariable Long id,
            @Valid @RequestBody FriendLinkRequest request) {
        FriendLinkResponse response = friendLinkService.update(id, request);
        return ApiResponse.success("友情链接更新成功", response);
    }

    @Operation(summary = "删除友情链接")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @Parameter(description = "友情链接ID") @PathVariable Long id) {
        friendLinkService.delete(id);
        return ApiResponse.success("友情链接删除成功", null);
    }
}
