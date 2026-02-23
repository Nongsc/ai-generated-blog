package com.blog.api.controller.admin;

import com.blog.api.dto.request.PostRequest;
import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.dto.response.PostResponse;
import com.blog.api.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Admin 后台 - 文章管理接口（需认证）
 */
@Tag(name = "Admin - 文章管理", description = "Admin 文章管理接口")
@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final PostService postService;

    @Operation(summary = "创建文章")
    @PostMapping
    public ApiResponse<PostResponse> create(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = postService.create(request, userDetails.getUsername());
        return ApiResponse.success("文章创建成功", response);
    }

    @Operation(summary = "根据ID获取文章")
    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getById(
            @Parameter(description = "文章ID") @PathVariable Long id) {
        PostResponse response = postService.getById(id);
        return ApiResponse.success(response);
    }

    @Operation(summary = "分页获取文章列表")
    @GetMapping
    public ApiResponse<PageResponse<PostResponse>> getPage(
            @Parameter(description = "页码（从0开始）") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "状态筛选") @RequestParam(required = false) Integer status,
            @Parameter(description = "分类ID筛选") @RequestParam(required = false) Long categoryId) {
        PageResponse<PostResponse> response = postService.getPage(page, size, status, categoryId);
        return ApiResponse.success(response);
    }

    @Operation(summary = "更新文章")
    @PutMapping("/{id}")
    public ApiResponse<PostResponse> update(
            @Parameter(description = "文章ID") @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {
        PostResponse response = postService.update(id, request);
        return ApiResponse.success("文章更新成功", response);
    }

    @Operation(summary = "删除文章")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @Parameter(description = "文章ID") @PathVariable Long id) {
        postService.delete(id);
        return ApiResponse.success("文章删除成功", null);
    }
}
