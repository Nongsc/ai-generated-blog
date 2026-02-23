package com.blog.api.controller.admin;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.MediaResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.entity.User;
import com.blog.api.service.AuthService;
import com.blog.api.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Admin 后台 - 媒体管理接口（需认证）
 */
@Tag(name = "Admin - 媒体管理", description = "Admin 媒体管理接口")
@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaService mediaService;
    private final AuthService authService;

    @Operation(summary = "上传文件")
    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<MediaResponse> upload(
            @Parameter(description = "要上传的文件") @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        MediaResponse response = mediaService.upload(file, user.getId());
        return ApiResponse.success("文件上传成功", response);
    }

    @Operation(summary = "根据ID获取媒体信息")
    @GetMapping("/{id}")
    public ApiResponse<MediaResponse> getById(
            @Parameter(description = "媒体ID") @PathVariable Long id) {
        MediaResponse response = mediaService.getById(id);
        return ApiResponse.success(response);
    }

    @Operation(summary = "分页获取媒体列表")
    @GetMapping
    public ApiResponse<PageResponse<MediaResponse>> getPage(
            @Parameter(description = "页码（从0开始）") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "上传者ID筛选") @RequestParam(required = false) Long uploaderId) {
        PageResponse<MediaResponse> response = mediaService.getPage(page, size, uploaderId);
        return ApiResponse.success(response);
    }

    @Operation(summary = "获取最近上传的媒体")
    @GetMapping("/recent")
    public ApiResponse<List<MediaResponse>> getRecent(
            @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit) {
        List<MediaResponse> response = mediaService.getRecent(limit);
        return ApiResponse.success(response);
    }

    @Operation(summary = "删除媒体")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @Parameter(description = "媒体ID") @PathVariable Long id) {
        mediaService.delete(id);
        return ApiResponse.success("媒体删除成功", null);
    }
}
