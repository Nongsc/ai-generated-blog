package com.blog.api.controller.blog;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.dto.response.PostResponse;
import com.blog.api.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Blog 前台 - 文章接口（公开）
 */
@Tag(name = "Blog - 文章", description = "Blog 前台文章接口")
@RestController
@RequestMapping("/api/blog/posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final PostService postService;

    @Operation(summary = "根据ID获取文章")
    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getById(
            @Parameter(description = "文章ID") @PathVariable Long id) {
        PostResponse response = postService.getById(id);
        return ApiResponse.success(response);
    }

    @Operation(summary = "根据Slug获取文章")
    @GetMapping("/slug/{slug}")
    public ApiResponse<PostResponse> getBySlug(
            @Parameter(description = "文章别名") @PathVariable String slug) {
        PostResponse response = postService.getBySlug(slug);
        return ApiResponse.success(response);
    }

    @Operation(summary = "分页获取文章列表（仅已发布）")
    @GetMapping
    public ApiResponse<PageResponse<PostResponse>> getPage(
            @Parameter(description = "页码（从0开始）") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "分类ID筛选") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "标签ID筛选") @RequestParam(required = false) Long tagId) {
        // Blog 前台只显示已发布的文章 (status = 1)
        PageResponse<PostResponse> response;
        if (tagId != null) {
            response = postService.getPageByTagId(page, size, tagId);
        } else {
            response = postService.getPage(page, size, 1, categoryId);
        }
        return ApiResponse.success(response);
    }

    @Operation(summary = "增加浏览量")
    @PostMapping("/{id}/view")
    public ApiResponse<Void> incrementViewCount(
            @Parameter(description = "文章ID") @PathVariable Long id) {
        postService.incrementViewCount(id);
        return ApiResponse.success(null);
    }
}
